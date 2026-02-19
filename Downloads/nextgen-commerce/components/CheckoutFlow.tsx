import React, { useState } from 'react';
import type { CartItem, Customer } from '../types';
import { createOrder } from '../services/orderService';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import PaymentGateway from './PaymentGateway';

interface CheckoutFlowProps {
  cartItems: CartItem[];
  onOrderPlaced: () => void;
  onBackToCart: () => void;
}

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ cartItems, onOrderPlaced, onBackToCart }) => {
  const [currentStep, setCurrentStep] = useState<'info' | 'payment' | 'success'>('info');
  const [customerInfo, setCustomerInfo] = useState<Customer>({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrders, setPlacedOrders] = useState<any[]>([]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 50; // Fixed delivery fee
  const total = subtotal + deliveryFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      alert('Please fill in all required fields.');
      return;
    }

    setCurrentStep('payment');
  };

  const handlePaymentSuccess = (orders: any[]) => {
    setPlacedOrders(orders);
    setOrderPlaced(true);
    setCurrentStep('success');
    onOrderPlaced();
  };

  const handlePaymentCancel = () => {
    setCurrentStep('info');
  };

  if (currentStep === 'payment') {
    return (
      <PaymentGateway
        amount={total}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentCancel={handlePaymentCancel}
        customerInfo={customerInfo}
        cartItems={cartItems}
      />
    );
  }

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-secondary rounded-lg p-8 border border-slate-700">
          <div className="text-center mb-8">
            <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-400">Your order has been placed and is being processed.</p>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold">Order Details</h2>
            {placedOrders.map((order, index) => (
              <div key={order.id} className="bg-slate-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{order.productName}</h3>
                    <p className="text-sm text-gray-400">Quantity: {order.quantity}</p>
                    <p className="text-sm text-gray-400">Tracking ID: {order.trackingId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.price * order.quantity)}</p>
                    <p className="text-sm text-yellow-400">Status: {order.status.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Delivery Information</h3>
            <p className="text-sm text-gray-400">Name: {customerInfo.name}</p>
            <p className="text-sm text-gray-400">Address: {customerInfo.address}</p>
            <p className="text-sm text-gray-400">Phone: {customerInfo.phone}</p>
            <p className="text-sm text-gray-400">Email: {customerInfo.email}</p>
          </div>

          <div className="text-center">
            <p className="text-gray-400 mb-4">
              You will receive WhatsApp updates about your order status.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Customer Information Step
  return (
    <div className="min-h-screen bg-primary text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={onBackToCart}
            className="text-accent hover:text-accent-hover transition-colors"
          >
            ← Back to Cart
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
              <span className="ml-2 text-accent font-medium">Customer Info</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-600 mx-4"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-slate-400 font-bold text-sm">
                2
              </div>
              <span className="ml-2 text-slate-400 font-medium">Payment</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-600 mx-4"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-slate-400 font-bold text-sm">
                3
              </div>
              <span className="ml-2 text-slate-400 font-medium">Success</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <div className="bg-secondary rounded-lg p-6 border border-slate-700">
            <h2 className="text-2xl font-bold mb-6">Customer Information</h2>
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-primary border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-primary border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-primary border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                  Delivery Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-primary border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Enter your complete delivery address"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent text-white font-bold rounded-lg shadow-md hover:bg-accent-hover transition-all flex items-center justify-center"
              >
                Proceed to Payment - {formatPrice(total)}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-secondary rounded-lg p-6 border border-slate-700">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-700 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-slate-700 pt-2">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
              <h3 className="font-semibold text-blue-300 mb-2">What's Next?</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Secure payment processing</li>
                <li>• Order verification by our team</li>
                <li>• WhatsApp updates on order status</li>
                <li>• Real-time order tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFlow;
