import express from 'express';
import { databaseService } from '../../services/database.js';

const router = express.Router();

// Get all products
router.get('/', (req, res) => {
  try {
    const stmt = databaseService.prepare('SELECT * FROM products ORDER BY created_at DESC');
    const products = stmt.all();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = databaseService.prepare('SELECT * FROM products WHERE id = ?');
    const product = stmt.get(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get products by merchant
router.get('/merchant/:merchantId', (req, res) => {
  try {
    const { merchantId } = req.params;
    const stmt = databaseService.prepare('SELECT * FROM products WHERE merchant_id = ? ORDER BY created_at DESC');
    const products = stmt.all(merchantId);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by merchant:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create new product
router.post('/', (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      imageUrl,
      unit,
      largeCategory,
      cardColor,
      merchantId
    } = req.body;

    if (!name || !price || !category || !unit || !largeCategory || !cardColor || !merchantId) {
      return res.status(400).json({
        error: 'Name, price, category, unit, large category, card color, and merchant ID are required'
      });
    }

    const id = `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const stmt = databaseService.prepare(`
      INSERT INTO products (id, name, price, description, category, image_url, unit, large_category, card_color, merchant_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, name, price, description || '', category, imageUrl || '', unit, largeCategory, cardColor, merchantId);

    const product = {
      id,
      name,
      price,
      description: description || '',
      category,
      imageUrl: imageUrl || '',
      unit,
      largeCategory,
      cardColor,
      merchantId
    };
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if product exists
    const checkStmt = databaseService.prepare('SELECT id FROM products WHERE id = ?');
    const existing = checkStmt.get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Build dynamic update query
    const updateFields = [];
    const values = [];
    const allowedFields = ['name', 'price', 'description', 'category', 'image_url', 'unit', 'large_category', 'card_color'];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        values.push(updates[field]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = databaseService.prepare(`
      UPDATE products SET ${updateFields.join(', ')} WHERE id = ?
    `);

    stmt.run(...values);

    // Return updated product
    const selectStmt = databaseService.prepare('SELECT * FROM products WHERE id = ?');
    const updatedProduct = selectStmt.get(id);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const checkStmt = databaseService.prepare('SELECT id FROM products WHERE id = ?');
    const existing = checkStmt.get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const stmt = databaseService.prepare('DELETE FROM products WHERE id = ?');
    stmt.run(id);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
