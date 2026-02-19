const API_BASE = '/api/payments';

// Create Razorpay payment order
export const createPaymentOrder = async (
  amount: number,
  customerInfo: any,
  cartItems: any[]
) => {
  const response = await fetch(`${API_BASE}/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency: 'INR',
      customerInfo,
      cartItems,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create payment order');
  }

  return response.json();
};

// Verify payment and create order
export const verifyPayment = async (
  paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  },
  customerInfo: any,
  cartItems: any[]
) => {
  const response = await fetch(`${API_BASE}/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...paymentData,
      customerInfo,
      cartItems,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Payment verification failed');
  }

  return response.json();
};

// Get payment status
export const getPaymentStatus = async (orderId: string) => {
  const response = await fetch(`${API_BASE}/status/${orderId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get payment status');
  }

  return response.json();
};
