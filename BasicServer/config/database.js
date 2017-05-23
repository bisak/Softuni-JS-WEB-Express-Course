let storage = [
  {
    name: 'test',
    imageUrl: 'http://nodeframework.com/assets/img/js.png'
  },
  {
    name: 'test2',
    imageUrl: 'http://jscoderetreat.com/img/why-js.png'
  },
  {
    name: 'JS',
    imageUrl: 'https://raw.github.com/ottawajs/logo.js/master/ottawajs/OttawaJS.png'
  }
]

module.exports = {
  getAll () {
    return storage
  },
  addNew (data) {
    storage.push(data)
  },
  getItem (index) {
    return storage[index]
  }
}
