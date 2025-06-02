// backend/controllers/classSubjectController.js
const asyncHandler = require('express-async-handler');
const ClassSubject = require('../models/ClassSubject');
const Course = require('../models/Course');

// @desc    Create a class with subjects
// @route   POST /api/class-subjects
// @access  Private
const createClassSubject = asyncHandler(async (req, res) => {
  const { className, subjects,relatedPdfs } = req.body;

  // Validate input
  if (!className || !subjects || subjects.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a class name and at least one subject',
    });
  }

  // Check if there are any invalid subjects (empty strings)
  const invalidSubjects = subjects.filter(subject => !subject.name || subject.name.trim() === '');
  if (invalidSubjects.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Subject names cannot be empty',
    });
  }

  // Check if class already exists
  const existingClass = await ClassSubject.findOne({ className });
  if (existingClass) {
    return res.status(400).json({
      success: false,
      message: 'Class already exists',
    });
  }

  //  Validate related PDFs if provided
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

  // Create new class with subjects
  const classSubject = await ClassSubject.create({
    className,
    subjects,
    relatedPdfs: relatedPdfs || [],
  });

  res.status(201).json({
    success: true,
    data: classSubject,
  });
});

// @desc    Get all classes with subjects
// @route   GET /api/class-subjects
// @access  Private
const getClassSubjects = asyncHandler(async (req, res) => {
  const classSubjects = await ClassSubject.find().sort({ className: 1 });

  res.status(200).json({
    success: true,
    count: classSubjects.length,
    data: classSubjects,
  });
});

// @desc    Get a single class with subjects
// @route   GET /api/class-subjects/:id
// @access  Private
const getClassSubject = asyncHandler(async (req, res) => {
  const classSubject = await ClassSubject.findById(req.params.id);

  if (!classSubject) {
    return res.status(404).json({
      success: false,
      message: 'Class not found',
    });
  }

  res.status(200).json({
    success: true,
    data: classSubject,
  });
});

// @desc    Update a class
// @route   PUT /api/class-subjects/:id
// @access  Private
const updateClassSubject = asyncHandler(async (req, res) => {
  const { className } = req.body;

  // Find the class
  let classSubject = await ClassSubject.findById(req.params.id);

  if (!classSubject) {
    return res.status(404).json({
      success: false,
      message: 'Class not found',
    });
  }

  // Validate input
  if (!className) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a class name',
    });
  }

  // Check if another class with the same name exists
  if (className !== classSubject.className) {
    const existingClass = await ClassSubject.findOne({ 
      className, 
      _id: { $ne: req.params.id } 
    });
    
    if (existingClass) {
      return res.status(400).json({
        success: false,
        message: 'Class name already exists',
      });
    }
  }

  // Update class name
  classSubject = await ClassSubject.findByIdAndUpdate(
    req.params.id,
    { className },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: classSubject,
  });
});

// @desc    Add a subject to a class
// @route   POST /api/class-subjects/:id/subjects
// @access  Private
const addSubject = asyncHandler(async (req, res) => {
  const { name } = req.body;

  // Validate input
  if (!name || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Please provide a subject name',
    });
  }

  // Find the class
  const classSubject = await ClassSubject.findById(req.params.id);

  if (!classSubject) {
    return res.status(404).json({
      success: false,
      message: 'Class not found',
    });
  }

  // Check if subject already exists in this class
  const subjectExists = classSubject.subjects.some(
    (subject) => subject.name.toLowerCase() === name.toLowerCase()
  );

  if (subjectExists) {
    return res.status(400).json({
      success: false,
      message: 'Subject already exists in this class',
    });
  }

  // Add the subject
  classSubject.subjects.push({ name });
  await classSubject.save();

  res.status(200).json({
    success: true,
    data: classSubject,
  });
});

// @desc    Update a subject
// @route   PUT /api/class-subjects/:id/subjects/:subjectId
// @access  Private
const updateSubject = asyncHandler(async (req, res) => {
  const { name } = req.body;

  // Validate input
  if (!name || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Please provide a subject name',
    });
  }

  // Find the class
  const classSubject = await ClassSubject.findById(req.params.id);

  if (!classSubject) {
    return res.status(404).json({
      success: false,
      message: 'Class not found',
    });
  }

  // Find the subject
  const subject = classSubject.subjects.id(req.params.subjectId);

  if (!subject) {
    return res.status(404).json({
      success: false,
      message: 'Subject not found',
    });
  }

  // Check if another subject with same name exists in this class
  const subjectExists = classSubject.subjects.some(
    (s) => s._id.toString() !== req.params.subjectId && s.name.toLowerCase() === name.toLowerCase()
  );

  if (subjectExists) {
    return res.status(400).json({
      success: false,
      message: 'Subject name already exists in this class',
    });
  }

  // Update the subject
  subject.name = name;
  await classSubject.save();

  res.status(200).json({
    success: true,
    data: classSubject,
  });
});

// @desc    Delete a subject
// @route   DELETE /api/class-subjects/:id/subjects/:subjectId
// @access  Private
const deleteSubject = asyncHandler(async (req, res) => {
  // Find the class
  const classSubject = await ClassSubject.findById(req.params.id);

  if (!classSubject) {
    return res.status(404).json({
      success: false,
      message: 'Class not found',
    });
  }

  // Find the subject
  const subject = classSubject.subjects.id(req.params.subjectId);

  if (!subject) {
    return res.status(404).json({
      success: false,
      message: 'Subject not found',
    });
  }

  // Check if the subject is used in any course
  const subjectInUse = await Course.findOne({
    classSubject: req.params.id,
  });

  if (subjectInUse) {
    return res.status(400).json({
      success: false,
      message: 'Subject is used in courses and cannot be deleted',
    });
  }

  // Remove the subject
  classSubject.subjects.pull(req.params.subjectId);
  await classSubject.save();

  res.status(200).json({
    success: true,
    data: classSubject,
  });
});

// @desc    Delete a class with all its subjects
// @route   DELETE /api/class-subjects/:id
// @access  Private
const deleteClassSubject = asyncHandler(async (req, res) => {
  // Find the class
  const classSubject = await ClassSubject.findById(req.params.id);

  if (!classSubject) {
    return res.status(404).json({
      success: false,
      message: 'Class not found',
    });
  }

  // Check if the class is used in any course
  const classInUse = await Course.findOne({
    classSubject: req.params.id,
  });

  if (classInUse) {
    return res.status(400).json({
      success: false,
      message: 'Class is used in courses and cannot be deleted',
    });
  }

  // Delete the class
  await classSubject.remove();

  res.status(200).json({
    success: true,
    message: 'Class and all its subjects deleted successfully',
  });
});

module.exports = {
  createClassSubject,
  getClassSubjects,
  getClassSubject,
  updateClassSubject,
  addSubject,
  updateSubject,
  deleteSubject,
  deleteClassSubject,
};