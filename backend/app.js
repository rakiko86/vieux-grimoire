const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); 
require("dotenv").config();

const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

// Création d'une application Express //
const app = express();
//CORS //
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Connexion à MongoDB //
mongoose.connect(process.env.MONGO_URI,)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


// Rend les données exploitables en JSON //
app.use(express.json());

// Middlewares qui définissent les routes //
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

// Middleware pour les images //
app.use('/images', express.static(path.join(__dirname, 'images')));

// Export de l'app pour le server //
module.exports = app;