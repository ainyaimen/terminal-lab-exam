const express = require('express');
const Author = require('../models/Author');
const Book = require('./models/book');
const router = express.Router();

// Add a new author
router.post('/', async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;

    const newAuthor = new Author({ name, email, phoneNumber });

    await newAuthor.save();
    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an author
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure valid ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid author ID' });
    }

    const { name, email, phoneNumber } = req.body;

    const updatedAuthor = await Author.findByIdAndUpdate(
      id,
      { name, email, phoneNumber },
      { new: true, runValidators: true } // Run validation for fields
    );

    if (!updatedAuthor) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.status(200).json(updatedAuthor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an author
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure valid ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid author ID' });
    }

    const deletedAuthor = await Author.findByIdAndDelete(id);

    if (!deletedAuthor) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.status(200).json({ message: 'Author deleted successfully', author: deletedAuthor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch authors with more than 5 books
router.get('/overlinked', async (req, res) => {
  try {
    // Use MongoDB aggregation for efficiency
    const overlinkedAuthors = await Author.aggregate([
      {
        $lookup: {
          from: 'books', // Collection name for the 'Book' model
          localField: '_id',
          foreignField: 'author',
          as: 'books',
        },
      },
      {
        $addFields: { bookCount: { $size: '$books' } }, // Add a field for book count
      },
      {
        $match: { bookCount: { $gt: 5 } }, // Filter authors with more than 5 books
      },
      {
        $project: {
          books: 0, // Exclude the full list of books from the response
        },
      },
    ]);

    res.status(200).json(overlinkedAuthors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
