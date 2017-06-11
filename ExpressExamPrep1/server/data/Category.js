const mongoose = require('mongoose')

let categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
})

let Category = mongoose.model('Category', categorySchema)

module.exports = Category

module.exports.seedCategory = () => {
  Category.find().then(categories => {
    if (categories.length > 0) return

    Category.create({ name: 'All' })
  })
}
