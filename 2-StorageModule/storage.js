const fs = require('fs')
let storage = {}

function isString (key) {
  if (typeof key !== 'string') {
    throw Error('Key is not a string.')
  }
}

module.exports = {
  get (key) {
    isString(key)
    if (!storage.hasOwnProperty(key)) {
      throw Error('No key not found.')
    }
    return storage[key]
  },
  put (key, value) {
    isString(key)
    if (storage.hasOwnProperty(key)) {
      throw Error('Key already exists.')
    }
    storage[key] = value
  },
  update (key, value) {
    isString(key)
    if (!storage.hasOwnProperty(key)) {
      throw Error('No key not found.')
    }
    storage[key] = value
  },
  delete (key) {
    isString(key)
    if (!storage.hasOwnProperty(key)) {
      throw Error('No key not found.')
    }
    delete storage[key]
  },
  clear () {
    storage = {}
  },
  save () {
    fs.writeFileSync('storage.dat', JSON.stringify(storage))
  },
  load () {
    const file = fs.readFileSync('./storage.dat')
    storage = JSON.parse(file.toString())
  }

}
