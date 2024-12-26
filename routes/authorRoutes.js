const express = require('express');
const Author = require('../models/Author');
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
    const { name, email, phoneNumber } = req.body;

    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      { name, email, phoneNumber },
      { new: true }
    );

    res.status(200).json(updatedAuthor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an author
router.delete('/:id', async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);

    if (!deletedAuthor) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.status(200).json({ message: 'Author deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
