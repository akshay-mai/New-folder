// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const uploadRoute = require('./routes/google');

// Load environment variables
dotenv.config();
// console.log(connectDB)
// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3002', // if you're using port 3002
  'https://joyful-cassata-0ecc9f.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for PDF uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pdfs', require('./routes/pdfRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/class-subjects', require('./routes/classSubjectRoutes'));
app.use('/haha', uploadRoute);
// // Root route
// console.log('hello')
app.get('/', (req, res) => {
console.log('hello inside')

  res.send('Coaching Center API is running...');
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});