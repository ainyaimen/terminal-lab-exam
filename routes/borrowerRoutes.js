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


// Borrow a book
router.post('/:id/borrow/:bookId', async (req, res) => {
    try {
      const borrower = await Borrower.findById(req.params.id);
      if (!borrower) {
        return res.status(404).json({ error: 'Borrower not found' });
      }
  
      const book = await Book.findById(req.params.bookId);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      // Checking if there are no available copies
      if (book.availableCopies < 1) {
        return res.status(400).json({ error: 'No copies available' });
      }
  
      // Checkingg if borrower is at their borrowing limit
      const borrowingLimits = {
        Standard: 5,
        Premium: 10,
      };
      const maxBooks = borrowingLimits[borrower.membershipType] || 0; 
      if (borrower.borrowedBooks.length >= maxBooks) {
        return res.status(400).json({
          error: `Borrowing limit reached. ${borrower.membershipType} members can borrow up to ${maxBooks} books.`,
        });
      }
  

      book.availableCopies--;
      book.borrowCount++;
      borrower.borrowedBooks.push(book._id);
  
      await Promise.all([book.save(), borrower.save()]);
      res.status(200).json(borrower);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Return a book
router.post('/:id/return/:bookId', async (req, res) => {
    try {
      const borrower = await Borrower.findById(req.params.id);
      if (!borrower) {
        return res.status(404).json({ error: 'Borrower not found' });
      }
  
      const book = await Book.findById(req.params.bookId);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      // Check if the book is actually borrowed by the borrower
      if (!borrower.borrowedBooks.includes(book._id)) {
        return res.status(400).json({ error: 'This book was not borrowed by the borrower.' });
      }
  
      // Increase available copies and update borrower's list
      book.availableCopies++;
      borrower.borrowedBooks = borrower.borrowedBooks.filter(
        (borrowedBookId) => borrowedBookId.toString() !== book._id.toString()
      );
  
      await Promise.all([book.save(), borrower.save()]);
      res.status(200).json({ message: 'Book returned successfully', borrower });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Extend Borrow Logic
router.post('/:id/borrow/:bookId', async (req, res) => {
    try {
      const borrower = await Borrower.findById(req.params.id);
      if (!borrower) {
        return res.status(404).json({ error: 'Borrower not found' });
      }
  
      const book = await Book.findById(req.params.bookId);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      // Check if borrower has overdue books
      if (borrower.overdueBooks.length > 0) {
        return res.status(400).json({
          error: 'Cannot borrow books while overdue books are not returned.',
        });
      }
  
      // Check if there are no available copies
      if (book.availableCopies < 1) {
        return res.status(400).json({ error: 'No copies available' });
      }
  
      // Check if borrower is at their borrowing limit
      const borrowingLimits = {
        standard: 5,
        premium: 10,
      };
      const maxBooks = borrowingLimits[borrower.membershipType] || 0;
      if (borrower.borrowedBooks.length >= maxBooks) {
        return res.status(400).json({
          error: `Borrowing limit reached. ${borrower.membershipType} members can borrow up to ${maxBooks} books.`,
        });
      }
  
      // Borrow the book
      book.availableCopies--;
      borrower.borrowedBooks.push(book._id);
  
      await Promise.all([book.save(), borrower.save()]);
      res.status(200).json(borrower);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });  
  

module.exports = router;
