const Book = require("../models/Book");
const fs = require("fs");

// Créer un livre
exports.createBook = (req, res, next) => {
    let bookObject;

    // Essayer de parser le corps JSON
    try {
        bookObject = JSON.parse(req.body.book);
    } catch (error) {
        if (req.file) {
            // Si une image a été téléchargée mais que le JSON est invalide, supprimer l'image
            fs.unlink(`images/${req.file.filename}`, () => { });
        }
        return res
            .status(400)
            .json({ message: "Données JSON invalides dans le corps de la requête" });
    }

    // Supprimer les champs inutiles
    delete bookObject._id;
    delete bookObject._userId;

    // Vérifier si une image est présente
    if (!req.file || !req.file.filename) {
        return res.status(400).json({ message: "Le fichier image est manquant" });
    }

    // Créer un objet book
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
            }`,
    });

    // Sauvegarder dans la base de données
    book
        .save()
        .then(() => res.status(201).json({ message: "Livre enregistré !" }))
        .catch((error) => {
            // Supprimer l'image en cas d'erreur
            if (req.file) {
                fs.unlink(`images/${req.file.filename}`, () => { });
            }
            res.status(400).json({ error });
        });
};

// Obtenir un livre spécifique
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book) {
                res.status(200).json(book);
            } else {
                res.status(404).json({ message: "Livre non trouvé" });
            }
        })
        .catch((error) => res.status(404).json({ error }));
};

// Modifier un livre
exports.modifyBook = (req, res, next) => {
    let updateBook;

    try {
        // Si une nouvelle image est envoyée, l'URL de l'image est modifiée
        updateBook = req.file
            ? {
                ...JSON.parse(req.body.book),
                imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
                    }`,
            }
            : { ...req.body };

        delete updateBook._userId;
    } catch (error) {
        if (req.file) {
            fs.unlink(`images/${req.file.filename}`, () => { });
        }
        return res.status(400).json({ message: "Format invalide du livre" });
    }

    // Trouver le livre à modifier
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId !== req.auth.userId) {
                return res.status(401).json({ message: "Non autorisé" });
            }

            // Supprimer l'ancienne image si une nouvelle image est envoyée
            if (req.file) {
                const oldFilename = book.imageUrl.split("/images/")[1];
                fs.unlink(`images/${oldFilename}`, () => {
                    updateBookInDatabase();
                });
            } else {
                updateBookInDatabase();
            }
        })
        .catch((error) => res.status(400).json({ error }));

    // Fonction pour mettre à jour le livre dans la base de données
    const updateBookInDatabase = () => {
        Book.updateOne(
            { _id: req.params.id },
            { ...updateBook, _id: req.params.id }
        )
            .then(() => res.status(200).json({ message: "Livre modifié !" }))
            .catch((error) => res.status(400).json({ error }));
    };
};
exports.addRating = async (req, res, next) => {
    try {
        const { grade } = req.body;
        const bookId = req.params.id;

        // Vérification de la validité de la note
        if (grade < 0 || grade > 5) {
            return res
                .status(400)
                .json({ message: "La note doit être comprise entre 0 et 5." });
        }

        // Trouver le livre correspondant
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Livre non trouvé." });
        }

        // Ajouter la nouvelle note
        book.ratings.push({
            userId: req.auth.userId,
            grade: grade,
        });

        // Calculer la nouvelle moyenne
        const totalGrades = book.ratings.reduce(
            (sum, rating) => sum + rating.grade,
            0
        );
        const averageRating = totalGrades / book.ratings.length;

        // Trouver la meilleure note
        const bestRating = Math.max(...book.ratings.map((rating) => rating.grade));

        // Mettre à jour le livre
        book.averageRating = averageRating;
        book.bestRating = bestRating; // Nouveau champ à ajouter au modèle, si souhaité
        await book.save();

        res.status(200).json({ message: "Note ajoutée avec succès.", book });
    } catch (error) {
        res.status(500).json({ error });
    }
};
exports.getBookStats = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Livre non trouvé." });
        }

        res.status(200).json({
            averageRating: book.averageRating,
            bestRating: book.bestRating,
            totalRatings: book.ratings.length,
            ratings: book.ratings,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Supprimer un livre
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId !== req.auth.userId) {
                return res.status(401).json({ message: "Non autorisé" });
            }

            const filename = book.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Livre supprimé !" }))
                    .catch((error) => res.status(401).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
};

// Obtenir tous les livres
exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};
