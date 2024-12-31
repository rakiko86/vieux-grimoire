const Book = require("../models/Book");
const fs = require('fs');
const book = new Book({
  title: req.body.title,
  author: req.body.author,
  imageUrl: req.body.imageUrl,
  year: req.body.year,
  userId: req.body.userId,
});

Book.save()
  .then(() => {
    res.status(201).json({
      message: "Post saved successfully!",
    });
  })
  .catch((error) => {
    res.status(400).json({
      error: error,
    });
  });
const Book = require("../models/Book");

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  book.save()
  .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};


exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id,
  })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  
  Book.findOne({ _id: req.params.id })
      .then((book) => {
          if (book.userId != req.auth.userId) {
              return res.status(401).json({ message: 'Not authorized' });
          } else {
              Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                  .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                  .catch(error => res.status(400).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};


exports.deleteBook = (req, res, next) => {
  Thing.findOne({ _id: req.params.id})
      .then(book => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Thing.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

exports.getAllBooks = (req, res, next) => {
    console.log('Fetching books from database...');
    Book.find()
        .then((books) => {
            console.log('Books found:', books);
            res.status(200).json(books);
        })
        .catch((error) => {
            console.error('Error fetching books:', error);
            res.status(400).json({ error });
        });
};


