// backend/controllers/pdfController.js
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const Pdf = require('../models/Pdf');

// @desc    Upload a PDF
// @route   POST /api/pdfs
// @access  Private
const uploadPdf = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a PDF file',
    });
  }

  const { title, description } = req.body;

  if (!title) {
    // Remove uploaded file if validation fails
    fs.unlinkSync(req.file.path);
    
    return res.status(400).json({
      success: false,
      message: 'Please provide a title',
    });
  }

  const pdf = await Pdf.create({
    title,
    description: description || '',
    filePath: req.file.path,
    fileName: req.file.filename,
  });

  res.status(201).json({
    success: true,
    data: pdf,
  });
});

// @desc    Get all PDFs
// @route   GET /api/pdfs
// @access  Private
const getPdfs = asyncHandler(async (req, res) => {
  const pdfs = await Pdf.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: pdfs.length,
    data: pdfs,
  });
});

// @desc    Get single PDF
// @route   GET /api/pdfs/:id
// @access  Private
const getPdf = asyncHandler(async (req, res) => {
  const pdf = await Pdf.findById(req.params.id);

  if (!pdf) {
    return res.status(404).json({
      success: false,
      message: 'PDF not found',
    });
  }

  res.status(200).json({
    success: true,
    data: pdf,
  });
});

// @desc    Update PDF info
// @route   PUT /api/pdfs/:id
// @access  Private
const updatePdf = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  // Find PDF
  let pdf = await Pdf.findById(req.params.id);

  if (!pdf) {
    return res.status(404).json({
      success: false,
      message: 'PDF not found',
    });
  }

  // Validate input
  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a title',
    });
  }

  // Update PDF data
  pdf = await Pdf.findByIdAndUpdate(
    req.params.id,
    { title, description },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: pdf,
  });
});

// @desc    Delete PDF
// @route   DELETE /api/pdfs/:id
// @access  Private
const deletePdf = asyncHandler(async (req, res) => {
  const pdf = await Pdf.findById(req.params.id);

  if (!pdf) {
    return res.status(404).json({
      success: false,
      message: 'PDF not found',
    });
  }

  // Delete file from storage
  const filePath = pdf.filePath;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Delete from database
  await pdf.remove();

  res.status(200).json({
    success: true,
    message: 'PDF deleted successfully',
  });
});

module.exports = {
  uploadPdf,
  getPdfs,
  getPdf,
  updatePdf,
  deletePdf,
};