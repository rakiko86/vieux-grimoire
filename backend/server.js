const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/user');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoutes);

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connexion réussie à MongoDB !'))
    .catch(err => console.error('Connexion à MongoDB échouée !', err));

// Écoutez sur le port
const PORT = process.env.PORT || 4000;
app.listen(PORT, (err) => {
    if (err) {
        return console.error('Erreur lors de l\'écoute du port :', err);
    }
    console.log(`Listening on port ${PORT}`);
});
