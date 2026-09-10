const { Pool } = require('pg');

// Require explicit environment variables; fail fast if missing
if (!process.env.DB_PASSWORD || !process.env.DB_HOST) {
    console.error("FATAL: Database configuration environment variables are missing.");
    process.exit(1);
}

// Implement connection pooling to manage resources efficiently
const pool = new Pool({
    user: process.env.DB_USER || 'admin',
    host: process.env.DB_HOST,
    database: process.env.DB_NAME || 'meliusai_prod',
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    max: 20, // Max number of connections in the pool
    idleTimeoutMillis: 30000
});

// Test connection safely without echoing credentials
pool.on('connect', () => {
    console.log('[DB] Successfully connected to the database pool.');
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};