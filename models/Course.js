const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a course description'],
  },
  duration: {
    type: String,
    required: [true, 'Please specify the course duration'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  // relatedPdfs: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Pdf',
  // }],
  // classSubject: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'ClassSubject',
  //   required: [true, 'Please specify the class and subject'],
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', CourseSchema);
