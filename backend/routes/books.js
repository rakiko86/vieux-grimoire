const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware d'authentification
const { upload, optimize } = require('../middleware/multer-config')
const booksCtrl = require('../controllers/book');


router.get('/bestrating', booksCtrl.getBestRatedBooks); // les meileurs notés //


router.post('/', auth, upload, optimize, booksCtrl.createBook); // Créer livre //
router.post('/:id/rating', auth, booksCtrl.rateBook); // Noter livre //
router.put('/:id', auth, upload, optimize, booksCtrl.modifyBook); // MAJ livre //
router.delete('/:id', auth, booksCtrl.deleteBook); // Supprimer livre //
router.get('/:id', booksCtrl.getOneBook); // Obtenir un livre spécifique //
router.get('/', booksCtrl.getAllBooks); // Obtenir tous les livres //

module.exports = router;