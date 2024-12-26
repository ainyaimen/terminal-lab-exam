const Borrower = require('../models/Borrower');
const Book = require('../models/book');

// Borrow a book
exports.borrowBook = async (req, res) => {
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
};

// Return a book
exports.returnBook = async (req, res) => {
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
};
