const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Mock controller function
const registerUser = (req, res) => {
    // If validation passes, process the sanitized data
    res.status(201).json({ success: true, message: 'User registered safely.' });
};

// Route with inline validation middleware
router.post('/register', [
    // Validate and sanitize email
    body('email')
        .isEmail().withMessage('Must be a valid email address.')
        .normalizeEmail(),
    
    // Validate password complexity
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
        .withMessage('Password must contain a letter, number, and special character.')
        .trim().escape(),
        
    // Validate string inputs
    body('username')
        .isString()
        .isLength({ min: 3, max: 30 })
        .trim().escape()
], (req, res, next) => {
    // Catch validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    // Pass to controller
    registerUser(req, res);
});

module.exports = router;