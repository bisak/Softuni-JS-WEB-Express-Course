const mongoose = require('mongoose')

let productSchema = mongoose.Schema({
  model: { type: mongoose.Schema.Types.String, required: true },
  description: { type: mongoose.Schema.Types.String },
  image: mongoose.Schema.Types.String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }
})

module.exports = mongoose.model('Car', productSchema)
