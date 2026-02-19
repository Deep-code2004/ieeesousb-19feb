import type { Order } from '../types';

/**
 * Sends a WhatsApp message to the customer with order details and status update.
 * This is a mock implementation. In a real application, integrate with WhatsApp Business API.
 * @param order The order object containing customer and order details.
 * @param message The message to send.
 */
export const sendWhatsAppMessage = async (order: Order, message: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock WhatsApp API call
      console.log(`Sending WhatsApp message to ${order.customer.phone}: ${message}`);
      // In a real implementation, use WhatsApp Business API or a service like Twilio
      resolve();
    }, 500); // Simulate network delay
  });
};

/**
 * Generates a WhatsApp message based on order status.
 * @param order The order object.
 * @returns The formatted message.
 */
export const generateStatusMessage = (order: Order): string => {
  const baseMessage = `Hello ${order.customer.name},\n\nYour order ${order.trackingId} for ${order.productName} (Qty: ${order.quantity}) has been updated.\n\n`;

  switch (order.status) {
    case 'PENDING_VERIFICATION':
      return `${baseMessage}Status: Pending Verification\nWe are verifying your order details. You will receive updates soon.`;
    case 'APPROVED':
      return `${baseMessage}Status: Approved\nYour order has been approved and is being prepared for shipment.`;
    case 'SHIPPED':
      return `${baseMessage}Status: Shipped\nYour order has been shipped and is on its way!\nDelivery Person: ${order.deliveryPerson.name} (${order.deliveryPerson.phone})\nVehicle: ${order.deliveryPerson.vehicle} (${order.deliveryPerson.licensePlate})`;
    case 'DELIVERED':
      return `${baseMessage}Status: Delivered\nYour order has been successfully delivered. Thank you for shopping with us!\n\nPlease leave a review if you have a moment.`;
    default:
      return `${baseMessage}Status: ${order.status}`;
  }
};

/**
 * Sends an automated WhatsApp message for order status updates.
 * @param order The updated order.
 */
export const sendOrderStatusUpdate = async (order: Order): Promise<void> => {
  const message = generateStatusMessage(order);
  await sendWhatsAppMessage(order, message);
};
