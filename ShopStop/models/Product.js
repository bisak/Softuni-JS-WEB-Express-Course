const mongoose = require('mongoose')

let productSchema = mongoose.Schema({
  name: { type: mongoose.Schema.Types.String, required: true },
  description: { type: mongoose.Schema.Types.String },
  price: {
    type: mongoose.Schema.Types.Number,
    min: 0,
    max: Number.MAX_VALUE,
    default: 0
  },
  image: mongoose.Schema.Types.String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  isBought: {type: mongoose.Schema.Types.Boolean, default: false}
})

module.exports = mongoose.model('Product', productSchema)
