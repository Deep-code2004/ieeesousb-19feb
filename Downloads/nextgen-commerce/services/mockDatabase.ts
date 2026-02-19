// Mock database service for browser compatibility
// This replaces the better-sqlite3 based database service

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  unit: string;
  largeCategory: string;
  cardColor: 'cyan' | 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  productId: string;
