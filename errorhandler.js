const logger = require('../utils/logger'); // Assume a standard logger exists

const errorHandler = (err, req, res, next) => {
    // Log the full error internally (with request ID/context) but NOT to the client
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);

    // Default to 500 internal server error
    const statusCode = err.statusCode || 500;
    
    // Determine the response message safely
    const responseMessage = process.env.NODE_ENV === 'production' 
        ? 'An unexpected internal server error occurred.' 
        : err.message;

    res.status(statusCode).json({
        success: false,
        error: responseMessage
    });
};

module.exports = { errorHandler };