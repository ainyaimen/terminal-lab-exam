const mongoose = require('mongoose');
const Author = require('/Author'); 

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: [true, 'Author is required'],
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
  },
  availableCopies: {
    type: Number,
    required: [true, 'Available copies are required'],
    min: [0, 'Available copies cannot be negative'],
  },
  borrowCount: {
    type: Number,
    default: 0,
  },
});

// Custom validation for availableCopies based on borrowCount
bookSchema.pre('save', function (next) {
  if (this.borrowCount > 10 && this.availableCopies > 100) {
    return next(new Error('Available copies cannot exceed 100 if the book has been borrowed more than 10 times.'));
  }
  next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
