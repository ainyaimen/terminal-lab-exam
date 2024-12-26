const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/library')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log(error));

// Import routes
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
const borrowerRoutes = require('./routes/borrowerRoutes');

// Use routes
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/borrowers', borrowerRoutes);


app.listen(3000, ()=>{
    console.log('server is running')
});
