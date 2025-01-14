
const Book = require("../models/Book");
const fs = require("fs");


// Fonction utilitaire pour supprimer une image
const deleteImage = (filename) => {
    return new Promise((resolve, reject) => {
        fs.unlink(`images/${filename}`, (error) => {
            if (error) {
                console.error('Erreur lors de la suppression de l\'image:', error);
                return reject(error);
            }
            resolve();
        });
    });
};

// Créer un livre
exports.createBook = async (req, res) => {
    let bookObject;

    try {
        bookObject = JSON.parse(req.body.book);
    } catch (error) {
        if (req.file) {
            deleteImage(req.file.filename).catch(console.error);
        }
        return res.status(400).json({ message: "Données JSON invalides dans le corps de la requête." });
    }

    if (!bookObject.title || !bookObject.author || !bookObject.year) {
        return res.status(400).json({ message: "Titre, auteur et année sont requis." });
    }

    if (!req.file || !req.file.filename) {
        return res.status(400).json({ message: "Le fichier image est manquant." });
    }

    const newBook = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/opt_${req.file.filename}`
,
    });

    try {
        await newBook.save();
        res.status(201).json({ message: "Livre enregistré !" });
    } catch (error) {
        if (req.file) {
            deleteImage(req.file.filename).catch(console.error);
        }
        res.status(500).json({ error });
    }
};

// Obtenir un livre spécifique
exports.getOneBook = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: "Livre non trouvé." });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Modifier un livre
exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/opt_${req.file.filename}`

    } : { ...req.body };
  
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Livre modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };
 
// Supprimer un livre
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });
        if (book.userId !== req.auth.userId) {
            return res.status(401).json({ message: "Non autorisé." });
        }

        const filename = book.imageUrl.split("/images/")[1];
        await deleteImage(filename);
        await Book.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: "Livre supprimé !" });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Obtenir tous les livres
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Noter un livre
exports.rateBook = async (req, res) => {
    try {
        const { userId } = req.auth; // Récupération de l'utilisateur authentifié
        const { rating } = req.body; // Note fournie dans la requête

        // Vérification de la validité de la note
        if (rating < 0 || rating > 5) {
            return res.status(400).json({ message: "La note doit se trouver entre 0 et 5." });
        }

        // Recherche du livre
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Livre non trouvé." });
        }

        // Vérification si l'utilisateur a déjà noté ce livre
        if (book.ratings.some((r) => r.userId === userId)) {
            return res.status(400).json({ message: "Vous avez déjà noté ce livre." });
        }

        // Ajout de la nouvelle note et recalcul de la moyenne
        book.ratings.push({ userId, grade: rating });
        const totalRating = book.ratings.reduce((sum, r) => sum + r.grade, 0);
        book.averageRating = totalRating / book.ratings.length;

        // Sauvegarde du livre avec les nouvelles données
        const updatedBook = await book.save();

        res.status(201).json(updatedBook);
    } catch (error) {
        console.error("Erreur lors de la notation du livre :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// Obtenir les 3 livres les mieux notés

exports.getBestRatedBooks= (req, res, next) => {
    Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};
