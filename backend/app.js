const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user'); // Correction ici
const path = require('path');

require('dotenv').config(); // Chargez les variables d'environnement en premier

// Utilisation de CORS
app.use(cors()); 
app.use(express.json()); // Middleware pour analyser le JSON


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require("dotenv").config();


// Création d'une application Express //
const app = express();

// Connexion à MongoDB //
mongoose.connect(process.env.DB_URI,
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS //
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Rend les données exploitables en JSON //
app.use(express.json());


// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connexion réussie à MongoDB !'))
    .catch(err => console.error('Connexion à MongoDB échouée !', err));

// Routes
app.use('/api/auth', userRoutes); // Utilisation des routes d'authentification
app.use('/api/books', booksRoutes); // Utilisation des routes de livres

app.use('/images', express.static(path.join(__dirname, 'images')));
module.exports = app; // Exporte votre application pour l'utiliser ailleurs