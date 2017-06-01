const mongoose = require('mongoose')

let categorySchema = mongoose.Schema({
  name: { type: mongoose.Schema.Types.String, unique: true, required: true },
  cars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }]
})

module.exports = mongoose.model('Owner', categorySchema)
