const mongoose = require('mongoose')

let answerSchema = new mongoose.Schema({
  answer: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
}, { timestamps: true })

let Answer = mongoose.model('Answer', answerSchema)

module.exports = Answer
