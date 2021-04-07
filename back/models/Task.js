const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
  id: {
    type: Number,
    require: true
  },
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  title: {
    type: String,
    require: true
  },
  content: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    require: true
  },
  color: {
    type: String,
    require: true
  },
  img: {
    data: Buffer,
    contentType: String
  }
})

module.exports = mongoose.model('Tasks2', TaskSchema);
