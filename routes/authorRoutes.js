const express = require('express');
const authorController = require('../controllers/authorController');
const router = express.Router();

// Add a new author
router.post('/', authorController.addAuthor);

// Update an author
router.put('/:id', authorController.updateAuthor);

// Delete an author
router.delete('/:id', authorController.deleteAuthor);

// Fetch authors with more than 5 books
router.get('/overlinked', authorController.getOverlinkedAuthors);

module.exports = router;
