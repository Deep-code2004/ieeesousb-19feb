import React from 'react';
import type { CartItem } from '../types';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ShoppingCartProps {
  cartItems: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout?: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ cartItems, onClose, onUpdateQuantity, onRemoveItem, onProceedToCheckout }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formatPrice = (price: number) => {
     return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-60 transition-opacity" onClick={onClose}></div>
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-secondary shadow-xl flex flex-col animate-in slide-in-from-right-full duration-300 border-l border-slate-700">
        <header className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Your Cart</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-lg text-gray-400">Your cart is empty.</p>
              <button onClick={onClose} className="mt-4 px-6 py-2 bg-accent text-white rounded-md font-semibold hover:bg-accent-hover transition-colors">
                Start Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-700">
              {cartItems.map(item => (
                <li key={item.id} className="flex py-4 space-x-4">
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{item.name}</h3>
                      <p className="text-sm text-gray-400">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                       <div className="flex items-center border border-slate-600 rounded-md bg-primary">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-300 hover:bg-slate-700 rounded-l-md">-</button>
                        <span className="px-3 py-1 text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-300 hover:bg-slate-700 rounded-r-md">+</button>
                      </div>
                      <button onClick={() => onRemoveItem(item.id)} className="text-gray-400 hover:text-red-400 transition-colors p-1">
                        <TrashIcon className="w-5 h-5" />
                        <span className="sr-only">Remove item</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <footer className="p-4 border-t border-slate-700 bg-primary">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-white">Subtotal</span>
              <span className="text-xl font-bold text-white">{formatPrice(subtotal)}</span>
            </div>
            <button
              onClick={onProceedToCheckout}
              className="w-full py-3 bg-accent text-white font-bold rounded-lg shadow-md hover:bg-accent-hover transition-all"
            >
              Proceed to Checkout
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;