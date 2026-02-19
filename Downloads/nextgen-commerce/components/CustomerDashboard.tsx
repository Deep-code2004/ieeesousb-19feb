import React from 'react';
import type { Product } from '../types';
import ProductGrid from './ProductGrid';
import ChatAssistant from './ChatAssistant';

interface CustomerDashboardProps {
  onProductSelect: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  onViewChange?: (view: 'customer' | 'admin' | 'merchant' | 'tracking') => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onProductSelect, onAddToCart, onViewChange }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight">
          An <span className="text-accent">Intelligent Shopping</span> Experience
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
          Your one-stop shop for everything you need, powered by AI.
        </p>
        {onViewChange && (
          <button
            onClick={() => onViewChange('tracking')}
            className="mt-6 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors"
          >
            Track Your Orders
          </button>
        )}
      </div>



      {/* Products Section */}
      <div className="mt-16">
         <ProductGrid onProductSelect={onProductSelect} onAddToCart={onAddToCart} />
      </div>
    </div>
  );
};

export default CustomerDashboard;
