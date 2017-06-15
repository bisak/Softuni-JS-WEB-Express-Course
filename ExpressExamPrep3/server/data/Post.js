const mongoose = require('mongoose')

let postSchema = new mongoose.Schema({
  description: { type: String, maxlength: 500, required: true },
  image: { type: String, required: true },
  creator: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.SchemaTypes.ObjectId }]
}, { timestamps: true })

postSchema.post('init', function (doc) {
  doc.views += 1
  doc.save()
})

let Post = mongoose.model('Post', postSchema)
module.exports = Post
