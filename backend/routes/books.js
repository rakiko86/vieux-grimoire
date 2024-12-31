const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware d'authentification
const multer =require('../middleware/multer-config')
const booksCtrl = require('../controllers/book'); // Contrôleur des livres



// Routes pour la gestion des livres
router.get('/bestrating', booksCtrl.getBestRatings); // Obtenir les meilleurs livres //

router.post('/',auth, multer, booksCtrl.createBook); // Création d'un livre
router.get('/:id', booksCtrl.getOneBook); // Récupération d'un livre par ID
router.put('/:id',auth, multer, booksCtrl.modifyBook); // Modification d'un livre
router.post('/:id/rating', auth, booksCtrl.ratingBook); // Noter livre //
router.delete('/:id',auth, booksCtrl.deleteBook); // Suppression d'un livre
router.get('/', booksCtrl.getAllBooks);
module.exports = router;
