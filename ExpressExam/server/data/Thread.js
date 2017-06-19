const mongoose = require('mongoose')

let threadSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
}, { timestamps: true })

let Thread = mongoose.model('Thread', threadSchema)

module.exports = Thread
