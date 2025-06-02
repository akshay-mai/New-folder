// backend/controllers/courseController.js
const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const ClassSubject = require('../models/ClassSubject');
const Pdf = require('../models/Pdf');

// @desc    Create a course
// @route   POST /api/courses
// @access  Private
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, duration, price} = req.body;

  // Validate required fields
  if (!title || !description || !duration || !price ) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  // Check if class/subject exists
  // const classSubject = await ClassSubject.findById(classSubjectId);
  // if (!classSubject) {
  //   return res.status(404).json({
  //     success: false,
  //     message: 'Class/Subject not found',
  //   });
  // }

  // Validate related PDFs if provided
  // if (relatedPdfs && relatedPdfs.length > 0) {
  //   const pdfIds = Array.isArray(relatedPdfs) ? relatedPdfs : [relatedPdfs];
  //   const pdfsExist = await Pdf.countDocuments({
  //     _id: { $in: pdfIds },
  //   });

  //   if (pdfsExist !== pdfIds.length) {
  //     return res.status(400).json({
  //       success: false,
  //       message: 'One or more related PDFs do not exist',
  //     });
  //   }
  // }

  // Create course
  const course = await Course.create({
    title,
    description,
    duration,
    price,
    // relatedPdfs: relatedPdfs || [],
    // classSubject: classSubjectId,
  });

  res.status(201).json({
    success: true,
    data: course,
  });
});

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find()
    .populate('classSubject', 'className subjects')
    .populate('relatedPdfs', 'title fileName')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('classSubject', 'className subjects')
    .populate('relatedPdfs', 'title fileName');

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found',
    });
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private
const updateCourse = asyncHandler(async (req, res) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found',
    });
  }

  const { title, description, duration, price, relatedPdfs, classSubjectId } = req.body;

  // Validate required fields
  if (title === undefined || description === undefined || duration === undefined || price === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  // Check if class/subject exists if provided
  if (classSubjectId) {
    const classSubject = await ClassSubject.findById(classSubjectId);
    if (!classSubject) {
      return res.status(404).json({
        success: false,
        message: 'Class/Subject not found',
      });
    }
  }

  // Validate related PDFs if provided
  if (relatedPdfs && relatedPdfs.length > 0) {
    const pdfIds = Array.isArray(relatedPdfs) ? relatedPdfs : [relatedPdfs];
    const pdfsExist = await Pdf.countDocuments({
      _id: { $in: pdfIds },
    });

    if (pdfsExist !== pdfIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more related PDFs do not exist',
      });
    }
  }

  // Update course
  course = await Course.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      duration,
      price,
      relatedPdfs: relatedPdfs || course.relatedPdfs,
      classSubject: classSubjectId || course.classSubject,
    },
    { new: true, runValidators: true }
  )
    .populate('classSubject', 'className subjects')
    .populate('relatedPdfs', 'title fileName');

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found',
    });
  }

  await course.remove();

  res.status(200).json({
    success: true,
    message: 'Course deleted successfully',
  });
});

module.exports = {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
};