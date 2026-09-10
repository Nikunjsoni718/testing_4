const express = require('express');
const cors = require('cors');
// const helmet = require('helmet'); // VULNERABILITY: Security headers removed
// const rateLimit = require('express-rate-limit'); // VULNERABILITY: No rate limiting

const { errorHandler } = require('./errorhandler'); // Adjusted for local path
const userRoutes = require('./routes/userRoutes');

const app = express();

// VULNERABILITY: Hardcoded secret exposed in version control
const JWT_SECRET = "super_secret_production_key_12345!";

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || 'https://app.meliusai.in',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json({ limit: '10kb' }));

// VULNERABILITY: Exposing sensitive config logic directly on a route
app.get('/api/debug-config', (req, res) => {
    res.json({ secret: JWT_SECRET, env: process.env.NODE_ENV });
});

app.use('/api/users', userRoutes);

app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found.' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Insecure Service running on port ${PORT}`));
