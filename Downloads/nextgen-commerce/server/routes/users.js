import express from 'express';
import { databaseService } from '../../services/database.js';

const router = express.Router();

// Get all customers
router.get('/customers', (req, res) => {
  try {
    const stmt = databaseService.prepare('SELECT * FROM customers ORDER BY created_at DESC');
    const customers = stmt.all();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get customer by ID
router.get('/customers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = databaseService.prepare('SELECT * FROM customers WHERE id = ?');
    const customer = stmt.get(id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Create new customer
router.post('/customers', (req, res) => {
  try {
    const { name, address, email, phone } = req.body;

    if (!name || !address || !email || !phone) {
      return res.status(400).json({ error: 'Name, address, email, and phone are required' });
    }

    const id = `c${Date.now()}`;
    const stmt = databaseService.prepare(`
      INSERT INTO customers (id, name, address, email, phone)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, name, address, email, phone);

    const customer = { id, name, address, email, phone };
    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(409).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create customer' });
    }
  }
});

// Get all merchants
router.get('/merchants', (req, res) => {
  try {
    const stmt = databaseService.prepare(`
      SELECT id, name, store_name, email, delivery_info, created_at, updated_at
      FROM merchants ORDER BY created_at DESC
    `);
    const merchants = stmt.all();
    res.json(merchants);
  } catch (error) {
    console.error('Error fetching merchants:', error);
    res.status(500).json({ error: 'Failed to fetch merchants' });
  }
});

// Get merchant by ID
router.get('/merchants/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = databaseService.prepare(`
      SELECT id, name, store_name, email, delivery_info, created_at, updated_at
      FROM merchants WHERE id = ?
    `);
    const merchant = stmt.get(id);

    if (!merchant) {
      return res.status(404).json({ error: 'Merchant not found' });
    }

    res.json(merchant);
  } catch (error) {
    console.error('Error fetching merchant:', error);
    res.status(500).json({ error: 'Failed to fetch merchant' });
  }
});

// Create new merchant
router.post('/merchants', (req, res) => {
  try {
    const { name, storeName, email, password, deliveryInfo } = req.body;

    if (!name || !storeName || !email || !password) {
      return res.status(400).json({ error: 'Name, store name, email, and password are required' });
    }

    const id = `m-${Date.now()}`;
    const stmt = databaseService.prepare(`
      INSERT INTO merchants (id, name, store_name, email, password, delivery_info)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, name, storeName, email, password, deliveryInfo || '');

    const merchant = {
      id,
      name,
      storeName,
      email,
      deliveryInfo: deliveryInfo || ''
    };
    res.status(201).json(merchant);
  } catch (error) {
    console.error('Error creating merchant:', error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(409).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create merchant' });
    }
  }
});

// Login merchant
router.post('/merchants/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const stmt = databaseService.prepare(`
      SELECT id, name, store_name, email, delivery_info, created_at, updated_at
      FROM merchants WHERE email = ? AND password = ?
    `);
    const merchant = stmt.get(email, password);

    if (!merchant) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json(merchant);
  } catch (error) {
    console.error('Error logging in merchant:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
