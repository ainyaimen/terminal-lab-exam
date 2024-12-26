const express = require('express');
const bookController = require('../controllers/bookController');
const router = express.Router();

// Add a new book
router.post('/', bookController.addBook);

// Update a book
router.put('/:id', bookController.updateBook);

// Delete a book
router.delete('/:id', bookController.deleteBook);

// Get all books
router.get('/', bookController.getAllBooks);

// Get a book by ID
router.get('/:id', bookController.getBookById);

module.exports = router;
