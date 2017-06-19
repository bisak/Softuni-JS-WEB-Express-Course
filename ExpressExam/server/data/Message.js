const mongoose = require('mongoose')

let messagesSchema = new mongoose.Schema({
  text: { type: String, required: true, maxlength: 1000 },
  likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  thread: {type: mongoose.Schema.Types.ObjectId, ref: 'Thread'},
  sender: {type: String}
}, { timestamps: true })

let Message = mongoose.model('Message', messagesSchema)

module.exports = Message
