const express = require('express');
const {
  createClassSubject,
  getClassSubjects,
  getClassSubject,
  updateClassSubject,
  addSubject,
  updateSubject,
  deleteSubject,
  deleteClassSubject
} = require('../controllers/classSubjectController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createClassSubject)
  .get(protect, getClassSubjects);

router.route('/:id')
  .get(protect, getClassSubject)
  .put(protect, updateClassSubject)
  .delete(protect, deleteClassSubject);

router.route('/:id/subjects')
  .post(protect, addSubject);

router.route('/:id/subjects/:subjectId')
  .put(protect, updateSubject)
  .delete(protect, deleteSubject);

module.exports = router;