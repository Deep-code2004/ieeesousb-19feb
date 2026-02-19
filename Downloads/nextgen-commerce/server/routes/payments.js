import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { databaseService } from '../../services/database.js';

const router = express.Router();

// Initialize Razorpay (you'll need to provide your keys)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'your_key_id_here',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret_here',
});

// Create payment order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', customerInfo, cartItems } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paisa (multiply by 100)
      currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    };

    const order = await razorpay.orders.create(options);

    // Store order details in database for verification later
    const stmt = databaseService.prepare(`
      INSERT INTO payment_orders (razorpay_order_id, amount, currency, status, customer_info, cart_items, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      order.id,
      amount,
      currency,
      'created',
      JSON.stringify(customerInfo),
      JSON.stringify(cartItems),
      new Date().toISOString()
    );

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// Verify payment
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerInfo,
      cartItems
    } = req.body;

    // Verify payment signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Update payment status in database
    const updateStmt = databaseService.prepare(`
      UPDATE payment_orders
      SET status = ?, razorpay_payment_id = ?, razorpay_signature = ?, verified_at = ?
      WHERE razorpay_order_id = ?
    `);

    updateStmt.run(
      'paid',
      razorpay_payment_id,
      razorpay_signature,
      new Date().toISOString(),
      razorpay_order_id
    );

    // Now create the actual order in the system
    const orders = [];

    for (const item of cartItems) {
      // Get available delivery people for the merchant
      const deliveryStmt = databaseService.prepare('SELECT * FROM delivery_people WHERE merchant_id = ?');
      const deliveryPeople = deliveryStmt.all(item.merchantId);

      if (deliveryPeople.length === 0) {
        throw new Error(`No delivery people available for merchant ${item.merchantId}`);
      }

      // Assign first available delivery person
      const deliveryPerson = deliveryPeople[0];

      const id = `ord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const trackingId = `VS${Date.now().toString().slice(-9)}`;

      const stmt = databaseService.prepare(`
        INSERT INTO orders (id, product_id, product_name, product_image_url, price, quantity, customer_id, merchant_id, delivery_person_id, status, tracking_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id,
        item.id,
        item.name,
        item.imageUrl || '',
        item.price,
        item.quantity,
        customerInfo.id,
        item.merchantId,
        deliveryPerson.id,
        'PENDING_VERIFICATION',
        trackingId
      );

      // Get the created order with full details
      const selectStmt = databaseService.prepare(`
        SELECT
          o.*,
          c.name as customer_name, c.address as customer_address, c.email as customer_email, c.phone as customer_phone,
          m.name as merchant_name, m.store_name as merchant_store_name,
          d.name as delivery_name, d.phone as delivery_phone, d.vehicle as delivery_vehicle, d.license_plate as delivery_license_plate
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        LEFT JOIN merchants m ON o.merchant_id = m.id
        LEFT JOIN delivery_people d ON o.delivery_person_id = d.id
        WHERE o.id = ?
      `);
      const createdOrder = selectStmt.get(id);

      const transformedOrder = {
        id: createdOrder.id,
        productId: createdOrder.product_id,
        productName: createdOrder.product_name,
        productImageUrl: createdOrder.product_image_url,
        price: createdOrder.price,
        quantity: createdOrder.quantity,
        status: createdOrder.status,
        trackingId: createdOrder.tracking_id,
        createdAt: createdOrder.created_at,
        customer: {
          id: createdOrder.customer_id,
          name: createdOrder.customer_name,
          address: createdOrder.customer_address,
          email: createdOrder.customer_email,
          phone: createdOrder.customer_phone
        },
        partnerStore: {
          id: createdOrder.merchant_id,
          name: createdOrder.merchant_store_name
        },
        deliveryPerson: createdOrder.delivery_name ? {
          id: createdOrder.delivery_person_id,
          name: createdOrder.delivery_name,
          phone: createdOrder.delivery_phone,
          vehicle: createdOrder.delivery_vehicle,
          licensePlate: createdOrder.delivery_license_plate
        } : undefined
      };

      orders.push(transformedOrder);
    }

    res.json({
      success: true,
      message: 'Payment verified and order placed successfully',
      paymentId: razorpay_payment_id,
      orders: orders,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Get payment status
router.get('/status/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const stmt = databaseService.prepare('SELECT * FROM payment_orders WHERE razorpay_order_id = ?');
    const payment = stmt.get(orderId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment order not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ error: 'Failed to fetch payment status' });
  }
});

export default router;
