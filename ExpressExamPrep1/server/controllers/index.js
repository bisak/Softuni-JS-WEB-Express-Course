const home = require('./home-controller')
const users = require('./users-controller')
const posts = require('./post-controller')
const categories = require('./categories-controller')

module.exports = {
  home: home,
  users: users,
  posts: posts,
  categories: categories
}
