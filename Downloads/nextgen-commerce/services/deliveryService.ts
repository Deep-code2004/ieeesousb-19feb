import type { DeliveryPerson } from '../types';

// Mock delivery people data
const mockDeliveryPeople: DeliveryPerson[] = [
  {
    id: 'd1',
    name: 'Mike Johnson',
    phone: '+91-9876543212',
    vehicle: 'Honda Activa',
    licensePlate: 'MH-01-AB-1234',
    merchantId: 'm-1'
  },
  {
    id: 'd2',
    name: 'Sarah Wilson',
    phone: '+91-9876543213',
    vehicle: 'Bajaj Pulsar',
    licensePlate: 'DL-05-CD-5678',
    merchantId: 'm-1'
  },
  {
    id: 'd3',
    name: 'Raj Patel',
    phone: '+91-9876543214',
    vehicle: 'TVS Apache',
    licensePlate: 'GJ-02-EF-5678',
    merchantId: 'm-2'
  }
];

export const getAvailableDeliveryPeople = (): Promise<DeliveryPerson[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDeliveryPeople), 300);
  });
};

export const createDeliveryPerson = (person: Omit<DeliveryPerson, 'id'>): Promise<DeliveryPerson> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPerson: DeliveryPerson = {
        ...person,
        id: `d${Date.now()}`
      };
      mockDeliveryPeople.push(newPerson);
      resolve(newPerson);
    }, 500);
  });
};

export const getDeliveryPeopleByMerchant = (merchantId: string): Promise<DeliveryPerson[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const deliveryPeople = mockDeliveryPeople.filter(p => p.merchantId === merchantId);
      resolve(deliveryPeople);
    }, 300);
  });
};
