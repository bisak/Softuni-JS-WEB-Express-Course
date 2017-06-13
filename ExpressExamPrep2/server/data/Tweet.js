const mongoose = require('mongoose')

let tweetSchema = new mongoose.Schema({
  content: { type: String, maxlength: 140, required: true },
  creator: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' },
  tags: [{ type: String }],
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.SchemaTypes.ObjectId }]
}, { timestamps: true })

tweetSchema.post('init', function (doc) {
  doc.views += 1
  doc.save()
})

let User = mongoose.model('Tweet', tweetSchema)
module.exports = User
