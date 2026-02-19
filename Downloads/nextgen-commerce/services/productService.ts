import type { Product } from '../types';

const API_BASE = '/api/products';

// API service functions
export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const products = await response.json();
  // Transform to match frontend types
  return products.map((product: any) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    category: product.category,
    imageUrl: product.image_url,
    unit: product.unit,
    largeCategory: product.large_category,
    cardColor: product.card_color,
    merchantId: product.merchant_id,
  }));
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const response = await fetch(`${API_BASE}/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  const product = await response.json();
  // Transform to match frontend types
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    category: product.category,
    imageUrl: product.image_url,
    unit: product.unit,
    largeCategory: product.large_category,
    cardColor: product.card_color,
    merchantId: product.merchant_id,
  };
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      imageUrl: product.imageUrl,
      unit: product.unit,
      largeCategory: product.largeCategory,
      cardColor: product.cardColor,
      merchantId: product.merchantId,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create product');
  }
  const createdProduct = await response.json();
  // Transform to match frontend types
  return {
    id: createdProduct.id,
    name: createdProduct.name,
    price: createdProduct.price,
    description: createdProduct.description,
    category: createdProduct.category,
    imageUrl: createdProduct.imageUrl,
    unit: createdProduct.unit,
    largeCategory: createdProduct.largeCategory,
    cardColor: createdProduct.cardColor,
    merchantId: createdProduct.merchantId,
  };
};

export const getProductsByMerchant = async (merchantId: string): Promise<Product[]> => {
  const response = await fetch(`${API_BASE}/merchant/${merchantId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products by merchant');
  }
  const products = await response.json();
  // Transform to match frontend types
  return products.map((product: any) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    category: product.category,
    imageUrl: product.image_url,
    unit: product.unit,
    largeCategory: product.large_category,
    cardColor: product.card_color,
    merchantId: product.merchant_id,
  }));
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: updates.name,
      price: updates.price,
      description: updates.description,
      category: updates.category,
      image_url: updates.imageUrl,
      unit: updates.unit,
      large_category: updates.largeCategory,
      card_color: updates.cardColor,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update product');
  }
  const updatedProduct = await response.json();
  // Transform to match frontend types
  return {
    id: updatedProduct.id,
    name: updatedProduct.name,
    price: updatedProduct.price,
    description: updatedProduct.description,
    category: updatedProduct.category,
    imageUrl: updatedProduct.image_url,
    unit: updatedProduct.unit,
    largeCategory: updatedProduct.large_category,
    cardColor: updatedProduct.card_color,
    merchantId: updatedProduct.merchant_id,
  };
};

export const deleteProduct = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete product');
  }
};
