// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './.env' });

// Import the routes files (we will create these later)
const usersRouter = require('./routes/users');
const projectsRouter = require('./routes/projects');
const teachersRouter = require('./routes/teachers');

// Create the Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(express.json()); // Allows us to parse JSON data from requests
app.use(cors()); // Enables cross-origin requests from our frontend

// Database Connection
const uri = process.env.ATLAS_URI;

mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB database connection established successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Basic API Route to test if the server is working
app.get('/', (req, res) => {
  res.send('Welcome to the Student Portfolio Platform API!');
});

// Use the routes (these will be ready once you create the files in the next steps)
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/teachers', teachersRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});