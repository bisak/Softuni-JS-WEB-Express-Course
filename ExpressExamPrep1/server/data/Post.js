const mongoose = require('mongoose')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let postSchema = new mongoose.Schema({
  title: { type: String, required: REQUIRED_VALIDATION_MESSAGE },
  description: { type: String, required: REQUIRED_VALIDATION_MESSAGE },
  user: { type: mongoose.Schema.Types.ObjectId, required: REQUIRED_VALIDATION_MESSAGE, ref: 'User' },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
  views: { type: Number, default: 0 },
  likes: [{type: mongoose.Schema.Types.ObjectId}],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
}, { timestamps: true })

let deepPopulate = require('mongoose-deep-populate')(mongoose)
postSchema.plugin(deepPopulate, {
  populate: {
    'answers': {
      options: {
        sort: { 'createdAt': -1 }
      }
    }
  }
})

let Post = mongoose.model('Post', postSchema)

module.exports = Post
