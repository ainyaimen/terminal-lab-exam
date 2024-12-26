const express = require('express');
const Book = require('../models/book');
const author = require('../models/Author');
const router = express.Router();

// Add a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, isbn, availableCopies } = req.body;

    const newBook = new Book({ title, author, isbn, availableCopies });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a book
router.put('/:id', async (req, res) => {
  try {
    const { title, author, isbn, availableCopies } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, isbn, availableCopies },
      { new: true }
    );

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a book
router.delete('/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
