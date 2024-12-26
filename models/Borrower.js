const mongoose = require('mongoose');
const Book = require('../Book');

const borrowerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  borrowedBooks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  }],
  membershipActive: {
    type: Boolean,
    required: true,
  },
  membershipType: {
    type: String,
    enum: ['standard', 'premium'],
    required: true,
  },
});

borrowerSchema.pre('save', function (next) {
  const borrowLimit = this.membershipType === 'premium' ? 10 : 5;
  if (this.borrowedBooks.length > borrowLimit) {
    return next(new Error(`You can only borrow up to ${borrowLimit} books at a time.`));
  }
  next();
});

const Borrower = mongoose.model('Borrower', borrowerSchema);

module.exports = Borrower;
