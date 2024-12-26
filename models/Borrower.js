const mongoose = require('mongoose');
const Book = require('/Book'); // Assuming Book schema is defined in another file

const borrowerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  borrowedBooks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  }],
  membershipActive: {
    type: Boolean,
    required: [true, 'Membership status is required'],
  },
  membershipType: {
    type: String,
    enum: ['standard', 'premium'],
    required: [true, 'Membership type is required'],
  },
});

// Custom validation for borrowing limits based on membership type
borrowerSchema.pre('save', function (next) {
  const borrowLimit = this.membershipType === 'premium' ? 10 : 5;
  if (this.borrowedBooks.length > borrowLimit) {
    return next(new Error(`You can only borrow up to ${borrowLimit} books at a time.`));
  }
  next();
});

const Borrower = mongoose.model('Borrower', borrowerSchema);

module.exports = Borrower;
