import React from 'react';
import type { Product } from './types';
import ProductGrid from './components/ProductGrid';

interface CustomerDashboardProps {
  onProductSelect: (product: Product) => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onProductSelect }) => {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Shop Our Products</h1>
      <p className="text-gray-500 mb-8">All orders are verified for your security.</p>
      <ProductGrid onProductSelect={onProductSelect} />
    </main>
  );
};

export default CustomerDashboard;
