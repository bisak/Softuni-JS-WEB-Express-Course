const mongoose = require('mongoose')

let categorySchema = mongoose.Schema({
  name: { type: mongoose.Schema.Types.String, unique: true, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
})

module.exports = mongoose.model('Category', categorySchema)
