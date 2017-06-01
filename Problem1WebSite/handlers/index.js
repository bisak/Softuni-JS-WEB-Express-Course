const homeHandler = require('./home')
const carHandler = require('./car')
const ownerHandler = require('./owner')

module.exports = {
  home: homeHandler,
  car: carHandler,
  owner: ownerHandler
}
