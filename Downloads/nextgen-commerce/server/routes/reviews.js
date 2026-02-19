import express from 'express';
import { databaseService } from '../../services/database.js';

const router = express.Router();

// Get all reviews
router.get('/', (req, res) => {
  try {
    const stmt = databaseService.prepare(`
      SELECT r.*, o.product_name, c.name as customer_name
      FROM reviews r
      LEFT JOIN orders o ON r.order_id = o.id
      LEFT JOIN customers c ON r.customer_name = c.name
      ORDER BY r.created_at DESC
    `);
    const reviews = stmt.all();
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get reviews by status
router.get('/status/:status', (req, res) => {
  try {
    const { status } = req.params;
    const stmt = databaseService.prepare(`
      SELECT r.*, o.product_name, c.name as customer_name
      FROM reviews r
      LEFT JOIN orders o ON r.order_id = o.id
      LEFT JOIN customers c ON r.customer_name = c.name
      WHERE r.status = ?
      ORDER BY r.created_at DESC
    `);
    const reviews = stmt.all(status);
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews by status:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Create review
router.post('/', (req, res) => {
  try {
    const { orderId, productId, rating, comment, customerName } = req.body;

    if (!orderId || !productId || !rating || !customerName) {
      return res.status(400).json({
        error: 'Order ID, product ID, rating, and customer name are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const id = `rev-${Date.now()}`;
    const stmt = databaseService.prepare(`
      INSERT INTO reviews (id, order_id, product_id, rating, comment, customer_name)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, orderId, productId, rating, comment || '', customerName);

    const review = {
      id,
      orderId,
      productId,
      rating,
      comment: comment || '',
      customerName,
      status: 'PENDING'
    };
    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Update review status
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['PENDING', 'APPROVED'].includes(status)) {
      return res.status(400).json({ error: 'Valid status (PENDING or APPROVED) is required' });
    }

    // Check if review exists
    const checkStmt = databaseService.prepare('SELECT id FROM reviews WHERE id = ?');
    const existing = checkStmt.get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Update status
    const stmt = databaseService.prepare('UPDATE reviews SET status = ? WHERE id = ?');
    stmt.run(status, id);

    // Return updated review
    const selectStmt = databaseService.prepare(`
      SELECT r.*, o.product_name, c.name as customer_name
      FROM reviews r
      LEFT JOIN orders o ON r.order_id = o.id
      LEFT JOIN customers c ON r.customer_name = c.name
      WHERE r.id = ?
    `);
    const updatedReview = selectStmt.get(id);
    res.json(updatedReview);
  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({ error: 'Failed to update review status' });
  }
});

export default router;
