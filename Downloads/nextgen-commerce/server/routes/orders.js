import express from 'express';
import { databaseService } from '../../services/database.js';

const router = express.Router();

// Get all orders
router.get('/', (req, res) => {
  try {
    const stmt = databaseService.prepare(`
      SELECT
        o.*,
        c.name as customer_name, c.address as customer_address, c.email as customer_email, c.phone as customer_phone,
        m.name as merchant_name, m.store_name as merchant_store_name,
        d.name as delivery_name, d.phone as delivery_phone, d.vehicle as delivery_vehicle, d.license_plate as delivery_license_plate
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN merchants m ON o.merchant_id = m.id
      LEFT JOIN delivery_people d ON o.delivery_person_id = d.id
      ORDER BY o.created_at DESC
    `);
    const orders = stmt.all();

    // Transform to match frontend format
    const transformedOrders = orders.map(order => ({
      id: order.id,
      productId: order.product_id,
      productName: order.product_name,
      productImageUrl: order.product_image_url,
      price: order.price,
      quantity: order.quantity,
      status: order.status,
      trackingId: order.tracking_id,
      createdAt: order.created_at,
      customer: {
        id: order.customer_id,
        name: order.customer_name,
        address: order.customer_address,
        email: order.customer_email,
        phone: order.customer_phone
      },
      partnerStore: {
        id: order.merchant_id,
        name: order.merchant_store_name
      },
      deliveryPerson: order.delivery_name ? {
        id: order.delivery_person_id,
        name: order.delivery_name,
        phone: order.delivery_phone,
        vehicle: order.delivery_vehicle,
        licensePlate: order.delivery_license_plate
      } : undefined
    }));

    res.json(transformedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = databaseService.prepare(`
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
    const order = stmt.get(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Transform to match frontend format
    const transformedOrder = {
      id: order.id,
      productId: order.product_id,
      productName: order.product_name,
      productImageUrl: order.product_image_url,
      price: order.price,
      quantity: order.quantity,
      status: order.status,
      trackingId: order.tracking_id,
      createdAt: order.created_at,
      customer: {
        id: order.customer_id,
        name: order.customer_name,
        address: order.customer_address,
        email: order.customer_email,
        phone: order.customer_phone
      },
      partnerStore: {
        id: order.merchant_id,
        name: order.merchant_store_name
      },
      deliveryPerson: order.delivery_name ? {
        id: order.delivery_person_id,
        name: order.delivery_name,
        phone: order.delivery_phone,
        vehicle: order.delivery_vehicle,
        licensePlate: order.delivery_license_plate
      } : undefined
    };

    res.json(transformedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create order
router.post('/', (req, res) => {
  try {
    const { productId, productName, productImageUrl, price, quantity, customerId, merchantId } = req.body;

    if (!productId || !productName || !price || !quantity || !customerId || !merchantId) {
      return res.status(400).json({
        error: 'Product ID, name, price, quantity, customer ID, and merchant ID are required'
      });
    }

    // Get available delivery people for the merchant
    const deliveryStmt = databaseService.prepare('SELECT * FROM delivery_people WHERE merchant_id = ?');
    const deliveryPeople = deliveryStmt.all(merchantId);

    if (deliveryPeople.length === 0) {
      return res.status(400).json({ error: 'No delivery people available for this merchant' });
    }

    // Assign first available delivery person (simple round-robin could be implemented later)
    const deliveryPerson = deliveryPeople[0];

    const id = `ord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const trackingId = `VS${Date.now().toString().slice(-9)}`;

    const stmt = databaseService.prepare(`
      INSERT INTO orders (id, product_id, product_name, product_image_url, price, quantity, customer_id, merchant_id, delivery_person_id, status, tracking_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, productId, productName, productImageUrl || '', price, quantity, customerId, merchantId, deliveryPerson.id, 'PENDING_VERIFICATION', trackingId);

    // Return the created order with full details
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
      deliveryPerson: {
        id: createdOrder.delivery_person_id,
        name: createdOrder.delivery_name,
        phone: createdOrder.delivery_phone,
        vehicle: createdOrder.delivery_vehicle,
        licensePlate: createdOrder.delivery_license_plate
      }
    };

    res.status(201).json(transformedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['PENDING_VERIFICATION', 'APPROVED', 'REJECTED', 'SHIPPED', 'DELIVERED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Check if order exists
    const checkStmt = databaseService.prepare('SELECT id FROM orders WHERE id = ?');
    const existing = checkStmt.get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update status
    const stmt = databaseService.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(status, id);

    // Return updated order
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
    const updatedOrder = selectStmt.get(id);

    const transformedOrder = {
      id: updatedOrder.id,
      productId: updatedOrder.product_id,
      productName: updatedOrder.product_name,
      productImageUrl: updatedOrder.product_image_url,
      price: updatedOrder.price,
      quantity: updatedOrder.quantity,
      status: updatedOrder.status,
      trackingId: updatedOrder.tracking_id,
      createdAt: updatedOrder.created_at,
      customer: {
        id: updatedOrder.customer_id,
        name: updatedOrder.customer_name,
        address: updatedOrder.customer_address,
        email: updatedOrder.customer_email,
        phone: updatedOrder.customer_phone
      },
      partnerStore: {
        id: updatedOrder.merchant_id,
        name: updatedOrder.merchant_store_name
      },
      deliveryPerson: updatedOrder.delivery_name ? {
        id: updatedOrder.delivery_person_id,
        name: updatedOrder.delivery_name,
        phone: updatedOrder.delivery_phone,
        vehicle: updatedOrder.delivery_vehicle,
        licensePlate: updatedOrder.delivery_license_plate
      } : undefined
    };

    res.json(transformedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
