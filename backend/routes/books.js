const express = require('express');
const router = express.Router();

// Importation du contrôleur des livres
const bookCtrl = require('../controllers/books');

// Routes pour la gestion des livres
router.post('/api/books', bookCtrl.createBook); // Création d'un livre
router.get('/api/books', bookCtrl.getAllBooks); // Récupération de tous les livres
router.get('/api/books/:id', bookCtrl.getOneBook); // Récupération d'un livre par ID
router.put('/api/books/:id', bookCtrl.modifyBook); // Modification d'un livre
router.delete('/api/books/:id', bookCtrl.deleteBook); // Suppression d'un livre

// Routes additionnelles pour l'authentification (si besoin)
router.post('/login', (req, res) => {
    res.status(200).json({ message: 'Login successful' });
});

router.post('/signup', (req, res) => {
    res.status(201).json({ message: 'Signup successful' });
});

module.exports = router;
