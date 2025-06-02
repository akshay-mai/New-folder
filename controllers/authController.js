// backend/controllers/authController.js
const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
const config = require('../config/config');

// @desc    Register admin (typically used during initial setup)
// @route   POST /api/auth/register
// @access  Public
const registerAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if admin already exists
  try{

    const adminExists = await Admin.findOne({ email });
  console.log({adminExists})
  if (adminExists) {
    return res.status(400).json({
      success: false,
      message: 'Admin already exists',
    });
  }
  }catch(e){
    console.log({e})
  }

  // Create admin
  const admin = await Admin.create({
    email,
    password,
  });

  // Send response with token
  sendTokenResponse(admin, 201, res);
});

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
console.log({email,password})
  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an email and password',
    });
  }

  // Check for admin
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check if password matches
  const isMatch = await admin.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Send response with token
  sendTokenResponse(admin, 200, res);
});

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin.id);

  res.status(200).json({
    success: true,
    data: admin,
  });
});

// @desc    Log admin out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Successfully logged out',
  });
});

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (admin, statusCode, res) => {
  // Create token
  const token = admin.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    admin: {
      id: admin._id,
      email: admin.email
    }
  });
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getMe,
  logout,
};