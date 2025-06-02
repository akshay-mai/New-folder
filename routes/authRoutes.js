// backend/routes/authRoutes.js
const express = require('express');
const { registerAdmin, loginAdmin, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;

// backend/routes/pdfRoutes.js


// backend/routes/courseRoutes.js


// backend/routes/classSubjectRoutes.js
