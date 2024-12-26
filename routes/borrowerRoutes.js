const express = require('express');
const Borrower = require('../models/Borrower');
const router = express.Router();

// Add a new borrower
router.post('/', async (req, res) => {
  try {
    const { name, borrowedBooks, membershipActive, membershipType } = req.body;

    const newBorrower = new Borrower({
      name,
      borrowedBooks,
      membershipActive,
      membershipType,
    });

    await newBorrower.save();
    res.status(201).json(newBorrower);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a borrower
router.put('/:id', async (req, res) => {
  try {
    const { name, borrowedBooks, membershipActive, membershipType } = req.body;

    const updatedBorrower = await Borrower.findByIdAndUpdate(
      req.params.id,
      { name, borrowedBooks, membershipActive, membershipType },
      { new: true }
    );

    res.status(200).json(updatedBorrower);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
