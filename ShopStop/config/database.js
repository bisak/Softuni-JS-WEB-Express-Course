let products = []
let count = 1

module.exports.products = {
  getAll: () => {
    return products
  },
  add: (product) => {
    product.id = count++
    products.push(product)
  },
  findByName: (name) => {
    let product = null
    for (let p of products) {
      if (name === p.name) {
        return p
      }
    }
    return product
  }
}
