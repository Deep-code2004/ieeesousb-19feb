import { databaseService } from '../services/database';
import fs from 'fs';
import path from 'path';

export const initializeDatabase = (): void => {
  try {
    // Initialize schema
    databaseService.initializeDatabase();
    console.log('Database schema initialized');

    // Seed data
    databaseService.seedDatabase();
    console.log('Database seeded with initial data');

  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Auto-initialize database when this module is imported
initializeDatabase();
