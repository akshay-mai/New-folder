const mongoose = require('mongoose');

const PdfSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  filePath: {
    type: String,
    required: [true, 'Please upload a PDF file'],
  },
  fileName: {
    type: String,
    required: [true, 'File name is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Pdf', PdfSchema);
