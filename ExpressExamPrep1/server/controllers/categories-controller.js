const Post = require('../data/Post')
const Category = require('../data/Category')

module.exports = {
  addCategory (req, res) {
    Category.create(req.body).then((dbResponse) => {
      return res.redirect('/categories')
    })
  },
  getAddCategoryView (req, res) {
    return res.render('category/add')
  },
  getAllCategoriesView (req, res) {
    Category.find().then((dbResponse) => {
      return res.render('category/all', {categories: dbResponse})
    })
  }
}
