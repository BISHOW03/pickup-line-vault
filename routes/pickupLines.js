// routes/pickupLines.js
const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/', (req, res) => {
  const { page = 1, limit = 20, category = '' } = req.query;
  const offset = (page - 1) * limit;

  let sql = 'SELECT * FROM pickup_lines';
  let values = [];

  if (category) {
    sql += ' WHERE category = ?';
    values.push(category);
  }

  sql += ' LIMIT ? OFFSET ?';
  values.push(parseInt(limit), parseInt(offset));

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error fetching pickup lines:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

module.exports = router;
