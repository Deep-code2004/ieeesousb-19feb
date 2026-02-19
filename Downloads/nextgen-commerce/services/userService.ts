import type { Customer, Merchant } from '../types';

const API_BASE = '/api/users';

// API service functions
export const getCustomers = async (): Promise<Customer[]> => {
  const response = await fetch(`${API_BASE}/customers`);
  if (!response.ok) {
    throw new Error('Failed to fetch customers');
  }
  return response.json();
};

export const getCustomerById = async (id: string): Promise<Customer | null> => {
  const response = await fetch(`${API_BASE}/customers/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Failed to fetch customer');
  }
  return response.json();
};

export const createCustomer = async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
  const response = await fetch(`${API_BASE}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create customer');
  }
  return response.json();
};

export const getMerchants = async (): Promise<Merchant[]> => {
  const response = await fetch(`${API_BASE}/merchants`);
  if (!response.ok) {
    throw new Error('Failed to fetch merchants');
  }
  const merchants = await response.json();
  // Transform to match frontend type
  return merchants.map((merchant: any) => ({
    id: merchant.id,
    name: merchant.name,
    email: merchant.email,
    storeName: merchant.store_name,
    deliveryInfo: merchant.delivery_info,
  }));
};

export const getMerchantById = async (id: string): Promise<Merchant | null> => {
  const response = await fetch(`${API_BASE}/merchants/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Failed to fetch merchant');
  }
  const merchant = await response.json();
  // Transform to match frontend type
  return {
    id: merchant.id,
    name: merchant.name,
    email: merchant.email,
    storeName: merchant.store_name,
    deliveryInfo: merchant.delivery_info,
  };
};

export const createMerchant = async (merchant: Omit<Merchant, 'id'>): Promise<Merchant> => {
  const response = await fetch(`${API_BASE}/merchants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: merchant.name,
      storeName: merchant.storeName,
      email: merchant.email,
      password: merchant.password,
      deliveryInfo: merchant.deliveryInfo,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create merchant');
  }
  const createdMerchant = await response.json();
  // Transform to match frontend type
  return {
    id: createdMerchant.id,
    name: createdMerchant.name,
    storeName: createdMerchant.storeName,
    email: createdMerchant.email,
    deliveryInfo: createdMerchant.deliveryInfo,
  };
};

export const loginMerchant = async (email: string, password: string): Promise<Merchant> => {
  const response = await fetch(`${API_BASE}/merchants/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  const merchant = await response.json();
  // Transform to match frontend type
  return {
    id: merchant.id,
    name: merchant.name,
    email: merchant.email,
    storeName: merchant.store_name,
    deliveryInfo: merchant.delivery_info,
  };
};

export const registerCustomer = async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
  return createCustomer(customer);
};
