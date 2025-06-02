const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a subject name'],
    trim: true,
  },
  relatedPdfs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pdf',
  }],
});

const ClassSubjectSchema = new mongoose.Schema({
  className: {
    type: String,
    required: [true, 'Please add a class name'],
    trim: true,
  },
  subjects: [SubjectSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  }
  
});

module.exports = mongoose.model('ClassSubject', ClassSubjectSchema);