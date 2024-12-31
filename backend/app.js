const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const booksRoutes = require('./routes/books');
const authRoutes = require('./routes/user'); // Correction ici
const path = require('path');

require('dotenv').config(); // Chargez les variables d'environnement en premier
const app = express(); 

// Utilisation de CORS
app.use(cors()); 
app.use(express.json()); // Middleware pour analyser le JSON

// Middleware pour logger les requêtes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connexion réussie à MongoDB !'))
    .catch(err => console.error('Connexion à MongoDB échouée !', err));

// Routes
app.use('/api/auth', authRoutes); // Utilisation des routes d'authentification
app.use('/api/books', booksRoutes); // Utilisation des routes de livres
app.use('/api/user', userRoutes); // Utilisation des routes utilisateur (si nécessaire)
app.use('/images', express.static(path.join(__dirname, 'images')));
module.exports = app; // Exporte votre application pour l'utiliser ailleurs