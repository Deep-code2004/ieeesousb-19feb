import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Database file path
const DB_PATH = path.join(process.cwd(), 'database', 'nextgen-commerce.db');

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Database service class
class DatabaseService {
  constructor() {
    this.db = db;
  }

  static getInstance() {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  getDatabase() {
    return this.db;
  }

  // Initialize database schema
  initializeDatabase() {
    try {
      const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf-8');
      this.db.exec(schema);
      console.log('Database schema initialized successfully');
    } catch (error) {
      console.error('Error initializing database schema:', error);
      throw error;
    }
  }

  // Seed database with initial data
  seedDatabase() {
    try {
      const seedPath = path.join(process.cwd(), 'database', 'seed.sql');
      const seedData = fs.readFileSync(seedPath, 'utf-8');
      this.db.exec(seedData);
      console.log('Database seeded successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    }
  }

  // Generic query methods
  prepare(sql) {
    return this.db.prepare(sql);
  }

  transaction(fn) {
    return this.db.transaction(fn)();
  }

  // Close database connection
  close() {
    this.db.close();
  }
}

// Export singleton instance
export const databaseService = DatabaseService.getInstance();
