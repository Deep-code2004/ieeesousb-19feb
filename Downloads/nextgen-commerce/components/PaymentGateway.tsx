import React, { useState, useEffect } from 'react';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { createPaymentOrder, verifyPayment } from '../services/paymentService';

interface PaymentGatewayProps {
  amount: number;
  onPaymentSuccess: (orders: any[]) => void;
  onPaymentCancel: () => void;
  customerInfo: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  cartItems: any[];
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  amount,
  onPaymentSuccess,
  onPaymentCancel,
  customerInfo,
  cartItems
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create payment order
      const orderData = await createPaymentOrder(amount, customerInfo, cartItems);

      // Initialize Razorpay checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: 'INR',
        name: 'NextGen Commerce',
        description: 'Order Payment',
        order_id: orderData.orderId,
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        theme: {
          color: '#06b6d4', // Cyan accent color
        },
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const result = await verifyPayment(
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              customerInfo,
              cartItems
            );

            onPaymentSuccess(result.orders);
          } catch (error) {
            console.error('Payment verification failed:', error);
            setError('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error('Failed to create payment order:', error);
      setError('Failed to initialize payment. Please try again.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      setError('Razorpay SDK not loaded. Please refresh the page.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-primary text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCardIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Secure Payment</h1>
          <p className="text-gray-400">Complete your payment to place the order</p>
        </div>

        <div className="bg-secondary rounded-lg p-6 border border-slate-700">
          {/* Payment Summary */}
          <div className="mb-6 p-4 bg-slate-800 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Amount to Pay</p>
                <p className="text-2xl font-bold text-accent">{formatPrice(amount)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Customer</p>
                <p className="font-medium">{customerInfo.name}</p>
                <p className="text-sm text-gray-400">{customerInfo.email}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-slate-700">
                  <div className="flex items-center">
                    <img src={item.imageUrl} alt={item.name} className="w-8 h-8 object-cover rounded mr-3" />
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-700">
              <span className="font-semibold">Total Amount</span>
              <span className="font-bold text-accent">{formatPrice(amount)}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Payment Methods Info */}
          <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
            <h4 className="font-semibold text-blue-300 mb-2">Available Payment Methods</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <p className="font-medium mb-1">💳 Cards</p>
                <p>Visa, Mastercard, RuPay</p>
              </div>
              <div>
                <p className="font-medium mb-1">📱 UPI</p>
                <p>Google Pay, PhonePe, Paytm</p>
              </div>
              <div>
                <p className="font-medium mb-1">🏦 Net Banking</p>
                <p>All major banks</p>
              </div>
              <div>
                <p className="font-medium mb-1">📱 Wallets</p>
                <p>Paytm, Mobikwik, Ola Money</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onPaymentCancel}
              className="flex-1 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>

            <button
              onClick={handlePayment}
              disabled={isLoading || !!error}
              className="flex-1 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors disabled:bg-slate-500 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <SpinnerIcon className="w-5 h-5 mr-2 animate-spin" />
                  Initializing Payment...
                </>
              ) : (
                `Pay ${formatPrice(amount)}`
              )}
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-sm text-green-300">
                🔒 Secured by Razorpay | PCI DSS Compliant | 256-bit SSL Encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
