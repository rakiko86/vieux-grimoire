const Book = require("../models/Book");
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
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    imageUrl: req.body.imageUrl,
    year: req.body.year,
    userId: req.body.userId,
  });
  book
    .save()
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
  const book = new Book({
    _id: req.params.id,
    title: req.body.title,
    author: req.body.author,
    imageUrl: req.body.imageUrl,
    year: req.body.year,
    userId: req.body.userId,
  });
  Book.findByIdAndUpdate({ _id: req.params.id }, Book)
    .then(() => {
      res.status(201).json({
        message: "Book updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: "Deleted!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
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


