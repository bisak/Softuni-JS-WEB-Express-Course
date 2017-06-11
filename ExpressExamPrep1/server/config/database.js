const mongoose = require('mongoose')
const User = require('../data/User')
require('../data/Post')
require('../data/Answer')
const Category = require('../data/Category')

mongoose.Promise = global.Promise

module.exports = (settings) => {
  mongoose.connect(settings.db)
  let db = mongoose.connection

  db.once('open', err => {
    if (err) {
      throw err
    }

    console.log('MongoDB ready!')

    User.seedAdminUser()
    Category.seedCategory()
  })

  db.on('error', err => console.log(`Database error: ${err}`))
}
