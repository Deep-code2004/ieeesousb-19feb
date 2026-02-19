
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getProducts } from '../services/productService';
import type { Product } from '../types';

interface ProductGridProps {
  onProductSelect: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ onProductSelect, onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
                 <div key={index} className="bg-white rounded-lg shadow-md animate-pulse">
                    <div className="w-full h-40 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} onSelect={onProductSelect} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

export default ProductGrid;
