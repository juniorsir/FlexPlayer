require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.text());

// Serve static files FIRST
app.use(express.static(path.join(__dirname, 'public')));

// Root route explicit handling
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check route (minimal dependencies)
app.get('/api/ping', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Helper to handle async routes correctly in Express 4
const asyncHandler = fn => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// API Routes - Lazy loaded to prevent startup crashes if a module has errors
app.all('/api/beacon', asyncHandler((req, res) => require('./routes/beacon.js')(req, res)));
app.all('/api/generate', asyncHandler((req, res) => require('./routes/generate.js')(req, res)));
app.all('/api/export-offline', asyncHandler((req, res) => require('./routes/export-offline.js')(req, res)));
app.all('/api/stats', asyncHandler((req, res) => require('./routes/stats.js')(req, res)));
app.all('/api/domains', asyncHandler((req, res) => require('./routes/domains.js')(req, res)));
app.all('/api/verify', asyncHandler((req, res) => require('./routes/verify.js')(req, res)));
app.all('/api/donate', asyncHandler((req, res) => require('./routes/donate.js')(req, res)));
app.all('/api/sponsor', asyncHandler((req, res) => require('./routes/sponsor.js')(req, res)));
app.all('/api/config', asyncHandler((req, res) => require('./routes/config.js')(req, res)));
app.all('/api/log', asyncHandler((req, res) => require('./routes/log.js')(req, res)));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});


// Serve static files (duplicate removed)
// app.use(express.static(path.join(__dirname, 'public')));

// Fallback for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  console.log('Server process starting...');

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  }).on('error', (err) => {
    console.error('Server failed to start:', err);
  });
}

module.exports = app;
