// routes/comments.js
const express = require('express');
const router = express.Router();
const { promisePool } = require('../db');

router.use(express.json());

router.post('/', async (req, res) => {
  const { pickup_line_id, comment } = req.body;
  try {
    await promisePool.query(
      'INSERT INTO comments (pickup_line_id, comment) VALUES (?, ?)',
      [pickup_line_id, comment]
    );
    res.status(201).send('Comment added');
  } catch (err) {
    res.status(500).send('Error adding comment');
  }
});

router.get('/:pickup_line_id', async (req, res) => {
  const { pickup_line_id } = req.params;
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM comments WHERE pickup_line_id = ?',
      [pickup_line_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).send('Error fetching comments');
  }
});

module.exports = router;
