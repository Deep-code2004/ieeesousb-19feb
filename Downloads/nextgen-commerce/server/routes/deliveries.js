import express from 'express';
import { databaseService } from '../../services/database.js';

const router = express.Router();

// Get all delivery people
router.get('/', (req, res) => {
  try {
    const stmt = databaseService.prepare('SELECT * FROM delivery_people ORDER BY created_at DESC');
    const deliveryPeople = stmt.all();
    res.json(deliveryPeople);
  } catch (error) {
    console.error('Error fetching delivery people:', error);
    res.status(500).json({ error: 'Failed to fetch delivery people' });
  }
});

// Get delivery people by merchant
router.get('/merchant/:merchantId', (req, res) => {
  try {
    const { merchantId } = req.params;
    const stmt = databaseService.prepare('SELECT * FROM delivery_people WHERE merchant_id = ? ORDER BY created_at DESC');
    const deliveryPeople = stmt.all(merchantId);
    res.json(deliveryPeople);
  } catch (error) {
    console.error('Error fetching delivery people by merchant:', error);
    res.status(500).json({ error: 'Failed to fetch delivery people' });
  }
});

// Create delivery person
router.post('/', (req, res) => {
  try {
    const { name, phone, vehicle, licensePlate, merchantId } = req.body;

    if (!name || !phone || !vehicle || !licensePlate || !merchantId) {
      return res.status(400).json({
        error: 'Name, phone, vehicle, license plate, and merchant ID are required'
      });
    }

    const id = `d-${Date.now()}`;
    const stmt = databaseService.prepare(`
      INSERT INTO delivery_people (id, name, phone, vehicle, license_plate, merchant_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, name, phone, vehicle, licensePlate, merchantId);

    const deliveryPerson = {
      id,
      name,
      phone,
      vehicle,
      licensePlate,
      merchantId
    };
    res.status(201).json(deliveryPerson);
  } catch (error) {
    console.error('Error creating delivery person:', error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(409).json({ error: 'License plate already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create delivery person' });
    }
  }
});

export default router;
