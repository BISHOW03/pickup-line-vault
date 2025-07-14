// routes/ratings.js
const express = require('express');
const router = express.Router();
const { promisePool } = require('../db');

router.use(express.json());

router.post('/', async (req, res) => {
  const { pickup_line_id, rating } = req.body;
  try {
    await promisePool.query(
      'INSERT INTO ratings (pickup_line_id, rating) VALUES (?, ?)',
      [pickup_line_id, rating]
    );
    res.status(201).send('Rating submitted');
  } catch (err) {
    res.status(500).send('Error adding rating');
  }
});

router.get('/:pickup_line_id', async (req, res) => {
  const { pickup_line_id } = req.params;
  try {
    const [rows] = await promisePool.query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM ratings WHERE pickup_line_id = ?',
      [pickup_line_id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).send('Error fetching ratings');
  }
});

module.exports = router;
