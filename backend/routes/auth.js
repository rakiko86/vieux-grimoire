const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    res.status(200).json({ message: 'Login successful' });
});

router.post('/signup', (req, res) => {
    res.status(201).json({ message: 'Signup successful' });
});

module.exports = router;
