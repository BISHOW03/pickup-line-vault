// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const pickupLinesRoutes = require('./routes/pickupLines');
const commentsRoutes = require('./routes/comments');
const ratingsRoutes = require('./routes/ratings');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/pickuplines', pickupLinesRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/ratings', ratingsRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
