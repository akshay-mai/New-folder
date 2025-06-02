const express = require('express');
const multer = require('multer');
const path = require('path');
const File = require('../models/Pdf');
const uploadFileToDrive = require('../controllers/drive');

const router = express.Router();

// Multer setup for local temp storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed!'));
  },
});

// Upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    const driveFile = await uploadFileToDrive(file);

    const newFile = await File.create({
      title,
      description,
      filePath: driveFile.webViewLink,
      fileName: driveFile.name,
    });

    res.status(200).json(newFile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
