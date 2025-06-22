const express = require('express');
const { uploadPdf, getPdfs, getPdf, updatePdf, deletePdf } = require('../controllers/pdfController');
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');

const router = express.Router();
// router.route('/ss').get((req,res)=>{console.log('hello pdf');res.json("hello")})
router.route('/')
  .post(protect, upload.single('pdf'), uploadPdf)
  .get( getPdfs);

router.route('/:id')
  .get(protect, getPdf)
  .put(protect, updatePdf)
  .delete(protect, deletePdf);

module.exports = router;