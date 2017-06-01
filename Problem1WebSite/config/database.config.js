const mongoose = require('mongoose')
mongoose.Promise = global.Promise

module.exports = (config) => {
  mongoose.connect(config.connectionString).then(() => {
    console.log('Connected!')
  }).catch((error) => {
    console.log('Error connecting to mongodb')
    console.error(error)
  })
}
