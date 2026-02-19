import React from 'react';
import type { CartItem } from './types';
import { XIcon } from './components/icons/XIcon';
import { TrashIcon } from './components/icons/TrashIcon';

interface ShoppingCartProps {
  cartItems: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ cartItems, onClose, onUpdateQuantity, onRemoveItem }) => {

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl flex flex-col animate-in slide-in-from-right-full duration-300">
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-lg text-gray-500">Your cart is empty.</p>
              <button onClick={onClose} className="mt-4 px-6 py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary-dark transition-colors">
                Start Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {cartItems.map(item => (
                <li key={item.id} className="flex py-4 space-x-4">
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                       <div className="flex items-center border border-gray-300 rounded-md">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md">-</button>
                        <span className="px-3 py-1 text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md">+</button>
                      </div>
                      <button onClick={() => onRemoveItem(item.id)} className="text-gray-400 hover:text-danger transition-colors p-1">
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
          <footer className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-800">Subtotal</span>
              <span className="text-xl font-bold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <button className="w-full py-3 bg-accent text-white font-bold rounded-lg shadow-md hover:bg-opacity-90 transition-all">
              Proceed to Checkout
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
