const Book = require('../models/book');
const Author = require('../models/Author');

// Add a new book
exports.addBook = async (req, res) => {
  try {
    const { title, author, isbn, availableCopies } = req.body;

    const newBook = new Book({ title, author, isbn, availableCopies });
    await newBook.save();

    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, availableCopies } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, isbn, availableCopies },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('author', 'name email');
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a book by ID
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id).populate('author', 'name email');

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
