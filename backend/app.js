const express = require('express');
const mongoose = require('mongoose');
const booksRoutes = require('./routes/books')
const cors = require('cors');
require('dotenv').config();

const app = express(); // Mettez l'initialisation de l'application en premier
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
// Utilisation de CORS
app.use(cors()); // Vous pouvez garder cela, il est plus clair
app.use(express.json()); // Le middleware pour analyser le JSON
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});



// Connexion à M

require('dotenv').config();
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connexion réussie à MongoDB !'))
    .catch(err => console.error('Connexion à MongoDB échouée !', err));



module.exports = app; // Exporte votre application pour l'utiliser ailleurs