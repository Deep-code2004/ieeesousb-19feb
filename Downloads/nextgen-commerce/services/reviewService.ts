import type { Review } from '../types';

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: 'r1',
    orderId: 'ord-1',
    productId: 'prod-1',
    productName: 'Fresh Tomatoes',
    rating: 5,
    comment: 'Excellent quality tomatoes, very fresh and juicy!',
    customer: {
      id: 'c1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '123 Main St'
    },
    createdAt: '2024-01-16T12:00:00Z',
    status: 'APPROVED'
  },
  {
    id: 'r2',
    orderId: 'ord-2',
    productId: 'prod-3',
    productName: 'Artisan Bread',
    rating: 4,
    comment: 'Great bread, soft and tasty. Will order again.',
    customer: {
      id: 'c2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      address: '456 Oak Ave'
    },
    createdAt: '2024-01-17T15:30:00Z',
    status: 'APPROVED'
  },
  {
    id: 'r3',
    orderId: 'ord-3',
    productId: 'prod-2',
    productName: 'Organic Milk',
    rating: 3,
    comment: 'Milk was okay, but packaging could be better.',
    customer: {
      id: 'c3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1234567892',
      address: '789 Pine Rd'
    },
    createdAt: '2024-01-18T10:15:00Z',
    status: 'PENDING'
  }
];

export const getReviews = (): Promise<Review[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockReviews), 500);
  });
};

export const getReviewsByProductId = (productId: string): Promise<Review[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reviews = mockReviews.filter(r => r.productId === productId && r.status === 'APPROVED');
      resolve(reviews);
    }, 300);
  });
};

export const getReviewsForProduct = (productId: string): Promise<Review[]> => {
  return getReviewsByProductId(productId);
};

export const submitReview = (review: Omit<Review, 'id' | 'createdAt' | 'status'>): Promise<Review> => {
  return createReview({
    ...review,
    status: 'PENDING',
  });
};

export const createReview = (review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReview: Review = {
        ...review,
        id: `r${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      mockReviews.push(newReview);
      resolve(newReview);
    }, 500);
  });
};

export const updateReviewStatus = (id: string, status: 'PENDING' | 'APPROVED'): Promise<Review> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const reviewIndex = mockReviews.findIndex(r => r.id === id);
      if (reviewIndex === -1) {
        reject(new Error(`Review with ID ${id} not found`));
        return;
      }
      mockReviews[reviewIndex].status = status;
      resolve(mockReviews[reviewIndex]);
    }, 300);
  });
};
