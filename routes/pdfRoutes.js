const express = require('express');
const { uploadPdf, getPdfs, getPdf, updatePdf, deletePdf } = require('../controllers/pdfController');
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, upload.single('pdf'), uploadPdf)
  .get(protect, getPdfs);

router.route('/:id')
  .get(protect, getPdf)
  .put(protect, updatePdf)
  .delete(protect, deletePdf);

module.exports = router;