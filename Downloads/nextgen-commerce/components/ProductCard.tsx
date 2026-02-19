import React from 'react';
import type { Product } from '../types';
import { PlusIcon } from './icons/PlusIcon';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onAddToCart }) => {
  const cardColorClass = {
    cyan: 'bg-card-cyan',
    blue: 'bg-card-blue',
    green: 'bg-card-green',
    orange: 'bg-card-orange',
    red: 'bg-card-red',
    purple: 'bg-card-purple',
  }[product.cardColor];

  const formatPrice = (price: number) => {
     return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);
  }

  return (
    <div 
      className="rounded-lg shadow-lg overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
      onClick={() => onSelect(product)}
    >
      <div className={`h-32 flex items-center justify-center p-4 ${cardColorClass}`}>
        <h2 className="text-2xl font-bold text-white text-center truncate">{product.largeCategory}</h2>
      </div>
      <div className="bg-secondary p-4">
        <h3 className="font-semibold text-white truncate">{product.name}</h3>
        <p className="text-gray-400 text-sm mt-1">{product.category}</p>
        <div className="flex justify-between items-center mt-3">
          <p className="text-white font-bold text-lg">{formatPrice(product.price)}</p>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              if (onAddToCart) {
                onAddToCart(product, 1); // Add 1 quantity
              }
            }}
            className="w-8 h-8 flex items-center justify-center bg-accent rounded-full text-white transition-transform group-hover:scale-110 hover:bg-accent-hover"
            aria-label="Add to cart"
          >
            <PlusIcon className="w-5 h-5"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
