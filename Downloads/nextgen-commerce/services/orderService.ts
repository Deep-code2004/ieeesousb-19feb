import type { Order, OrderStatus, CartItem, Customer } from '../types';

const API_BASE = '/api/orders';

// API service functions
export const getOrders = async (): Promise<Order[]> => {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  const response = await fetch(`${API_BASE}/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Failed to fetch order');
  }
  return response.json();
};

export const createOrder = async (cartItems: CartItem[], customer: Customer): Promise<Order[]> => {
  const orders: Order[] = [];

  for (const item of cartItems) {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: item.id,
        productName: item.name,
        productImageUrl: item.imageUrl,
        price: item.price,
        quantity: item.quantity,
        customerId: customer.id,
        merchantId: item.merchantId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }

    const order = await response.json();
    orders.push(order);
  }

  return orders;
};

export const updateOrderStatus = async (orderId: string, newStatus: OrderStatus): Promise<Order> => {
  const response = await fetch(`${API_BASE}/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update order status');
  }

  return response.json();
};
