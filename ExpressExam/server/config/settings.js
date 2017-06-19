const path = require('path')

let rootPath = path.normalize(path.join(__dirname, '/../../'))

module.exports = {
  development: {
    rootPath: rootPath,
    db: 'mongodb://localhost:27017/ExpressExamBiskazz',
    port: 1337
  },
  staging: {
    rootPath: rootPath,
    db: 'mongodb://localhost:27017/ExpressExamBiskazz',
    port: 1337
  },
  production: {
    rootPath: rootPath,
    db: 'mongodb://localhost:27017/ExpressExamBiskazz',
    port: 1337
  }
}
