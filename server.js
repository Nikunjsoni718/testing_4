const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorHandler');
const userRoutes = require('./routes/userRoutes');

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. Strict CORS Configuration
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || 'https://app.meliusai.in',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// 3. Body Parsing with strict size limits to prevent payload attacks
app.use(express.json({ limit: '10kb' }));

// 4. Global Rate Limiting to prevent brute-force and DDoS
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', globalLimiter);

// 5. Routes
app.use('/api/users', userRoutes);

// 6. Safe 404 Handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found.' });
});

// 7. Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Secure Service running on port ${PORT}`));