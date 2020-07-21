const express = require('express');

const userRoutes = require('./user');
const authRoutes = require('./auth');

const router = express.Router();

// Endpoint to check if the API is running
router.get('/api-status', (req, res) => res.json({ status: 'ok' }));

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
