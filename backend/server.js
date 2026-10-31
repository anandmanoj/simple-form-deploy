const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (frontend on Cloudflare Pages / localhost)
app.use(cors());
app.use(express.json());

// Root & Health check endpoints
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'simple-form-backend',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      submit: 'POST /api/submissions',
      list: 'GET /api/submissions'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/submissions - Retrieve all submissions
app.get('/api/submissions', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, message, created_at FROM submissions ORDER BY created_at DESC LIMIT 50'
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ success: false, error: 'Database query failed: ' + error.message });
  }
});

// POST /api/submissions - Save a new submission
app.post('/api/submissions', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required fields.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.'
      });
    }

    const result = await db.query(
      'INSERT INTO submissions (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name.trim(), email.trim().toLowerCase(), message ? message.trim() : '']
    );

    res.status(201).json({
      success: true,
      message: 'Submission successfully recorded!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error saving submission:', error);
    res.status(500).json({ success: false, error: 'Database insert failed: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server listening on port ${PORT}`);
});
