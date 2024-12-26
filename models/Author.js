const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^\d{11}$/,
  },
});

authorSchema.pre('save', function (next) {
  // Ensure author is linked to no more than 5 books
  this.model('Book').countDocuments({ author: this._id }, (err, count) => {
    if (count >= 5) {
      return next(new Error('Author cannot be linked to more than 5 books.'));
    }
    next();
  });
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
