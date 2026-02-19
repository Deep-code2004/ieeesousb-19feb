import type { Merchant } from '../types';

// Mock merchants data
const mockMerchants: Merchant[] = [
  {
    id: 'm-1',
    name: 'John Smith',
    storeName: 'Gourmet Foods Inc.',
    email: 'john@gourmetfoods.com',
    password: 'password123',
    deliveryInfo: 'Free delivery on orders over ₹500'
  },
  {
    id: 'm-2',
    name: 'Sarah Johnson',
    storeName: 'Fresh Produce Direct',
    email: 'sarah@freshproduce.com',
    password: 'password456',
    deliveryInfo: 'Same-day delivery available'
  }
];

/**
 * Mocks fetching a list of all registered merchants.
 * @returns A promise that resolves with an array of merchants.
 */
export const getMerchants = (): Promise<Merchant[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockMerchants);
        }, 600);
    });
};

/**
 * Registers a new merchant.
 * @param merchantData - The merchant data without id.
 * @returns A promise that resolves with the created merchant.
 */
export const registerMerchant = (merchantData: Omit<Merchant, 'id'>): Promise<Merchant> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newMerchant: Merchant = {
                ...merchantData,
                id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            };
            mockMerchants.push(newMerchant);
            resolve(newMerchant);
        }, 500);
    });
};

/**
 * Logs in a merchant.
 * @param email - The merchant's email.
 * @param password - The merchant's password.
 * @returns A promise that resolves with the merchant if login is successful, null otherwise.
 */
export const loginMerchant = (email: string, password: string): Promise<Merchant | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const merchant = mockMerchants.find(m => m.email === email && m.password === password) || null;
            resolve(merchant);
        }, 300);
    });
};
