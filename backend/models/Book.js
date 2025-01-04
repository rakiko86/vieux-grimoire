const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, required: true, min: 0, max: 5 },
    },
  ],
  averageRating: { type: Number, default: 0 },
  bestRating: { type: Number, default: 0 }, // Ajout pour la meilleure note
});
// Fonction pour calculer la moyenne
const averageRating = async (book) => {
    if (book.ratings && book.ratings.length > 0) { // Vérifie si des notes existent
        const totalNotes = book.ratings.reduce((total, rating) => total + rating.grade, 0); // Calcule la somme des notes
        book.averageRating = totalNotes / book.ratings.length; // Calcul de la moyenne
    } else {
        book.averageRating = 0; // Si pas de notes
    }
    return book.averageRating; // Retourne la moyenne calculée
};

// Middleware "pre('save')" pour mettre à jour la moyenne avant de sauvegarder
bookSchema.pre('save', async function (next) { // Utiliser 'async function' et 'this'
    await averageRating(this); // Assure que l'on utilise 'this' pour référencer le document
    next();
});

module.exports = mongoose.model('Book', bookSchema);
