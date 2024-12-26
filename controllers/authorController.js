const Author = require('../models/Author');
const Book = require('../models/book');

// Add a new author
exports.addAuthor = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;
    const newAuthor = new Author({ name, email, phoneNumber });
    await newAuthor.save();
    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an author
exports.updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber } = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid author ID' });
    }

    const updatedAuthor = await Author.findByIdAndUpdate(
      id,
      { name, email, phoneNumber },
      { new: true, runValidators: true }
    );

    if (!updatedAuthor) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.status(200).json(updatedAuthor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an author
exports.deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;

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
};

// Fetch authors with more than 5 books
exports.getOverlinkedAuthors = async (req, res) => {
  try {
    const overlinkedAuthors = await Author.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: 'author',
          as: 'books',
        },
      },
      {
        $addFields: { bookCount: { $size: '$books' } },
      },
      {
        $match: { bookCount: { $gt: 5 } },
      },
      {
        $project: { books: 0 },
      },
    ]);

    res.status(200).json(overlinkedAuthors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
