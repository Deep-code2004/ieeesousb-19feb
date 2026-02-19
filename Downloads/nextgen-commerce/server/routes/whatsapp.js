import express from 'express';

const router = express.Router();

// Send WhatsApp message (mock implementation)
router.post('/send', (req, res) => {
  try {
    const { order, message } = req.body;

    if (!order || !message) {
      return res.status(400).json({ error: 'Order and message are required' });
    }

    // Mock WhatsApp API call
    console.log(`Sending WhatsApp message to ${order.customer.phone}: ${message}`);

    // In a real implementation, integrate with WhatsApp Business API or Twilio
    res.json({ success: true, message: 'WhatsApp message sent successfully' });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ error: 'Failed to send WhatsApp message' });
  }
});

// Generate status message
router.post('/generate-status', (req, res) => {
  try {
    const { order } = req.body;

    if (!order) {
      return res.status(400).json({ error: 'Order is required' });
    }

    const baseMessage = `Hello ${order.customer.name},\n\nYour order ${order.trackingId} for ${order.productName} (Qty: ${order.quantity}) has been updated.\n\n`;

    let statusMessage = '';
    switch (order.status) {
      case 'PENDING_VERIFICATION':
        statusMessage = `${baseMessage}Status: Pending Verification\nWe are verifying your order details. You will receive updates soon.`;
        break;
      case 'APPROVED':
        statusMessage = `${baseMessage}Status: Approved\nYour order has been approved and is being prepared for shipment.`;
        break;
      case 'SHIPPED':
        statusMessage = `${baseMessage}Status: Shipped\nYour order has been shipped and is on its way!\nDelivery Person: ${order.deliveryPerson?.name} (${order.deliveryPerson?.phone})\nVehicle: ${order.deliveryPerson?.vehicle} (${order.deliveryPerson?.licensePlate})`;
        break;
      case 'DELIVERED':
        statusMessage = `${baseMessage}Status: Delivered\nYour order has been successfully delivered. Thank you for shopping with us!\n\nPlease leave a review if you have a moment.`;
        break;
      default:
        statusMessage = `${baseMessage}Status: ${order.status}`;
    }

    res.json({ message: statusMessage });
  } catch (error) {
    console.error('Error generating status message:', error);
    res.status(500).json({ error: 'Failed to generate status message' });
  }
});

export default router;
