
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
  merchantId: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED' | 'SHIPPED' | 'DELIVERED';

export interface Customer {
    id: string;
    name: string;
    address: string;
    email: string;
    phone: string;
}

export interface Merchant {
    id: string;
    name: string;
    storeName: string;
    email: string;
    password?: string; // Optional for API responses
    deliveryInfo?: string;
}

export interface DeliveryPerson {
    id: string;
    name: string;
    phone: string;
    vehicle: string;
    licensePlate: string;
    merchantId: string;
}

export interface PartnerStore {
    id: string;
    name: string;
}

export interface Order {
    id: string;
    productId: string;
    productName: string;
    productImageUrl: string;
    price: number;
    quantity: number;
    customer: Customer;
    partnerStore: PartnerStore;
    deliveryPerson: DeliveryPerson;
    status: OrderStatus;
    createdAt: string; // ISO date string
    trackingId: string;
}

export interface Review {
    id: string;
    orderId: string;
    productId: string;
    productName: string;
    rating: number; // 1-5
    comment: string;
    customer: Customer;
    createdAt: string; // ISO date string
    status: 'PENDING' | 'APPROVED';
}
