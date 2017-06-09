const mongoose = require('mongoose')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let articleSchema = new mongoose.Schema({
  title: { type: String, required: REQUIRED_VALIDATION_MESSAGE, unique: true },
  content: { type: String, required: REQUIRED_VALIDATION_MESSAGE },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

let Article = mongoose.model('Article', articleSchema)

module.exports = Article
