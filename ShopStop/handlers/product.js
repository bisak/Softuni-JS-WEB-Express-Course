const url = require('url')
const Product = require('../models/Product')
const Category = require('../models/Category')
const fs = require('fs')
const path = require('path')
const multiparty = require('multiparty')
const shortid = require('shortid')

module.exports.addGet = (req, res) => {
  Category.find().then((categories) => {
    res.render('products/add', { categories: categories })
  })
}
module.exports.addPost = (req, res) => {
  let productObj = req.body
  productObj.image = '\\' + req.file.path

  Product.create(productObj).then((insertedProduct) => {
    return Category.findById(insertedProduct.category).then(category => {
      category.products.push(insertedProduct._id)
      category.save()
      res.redirect('/')
    })
  }).catch((err) => {
    console.log(err)
  })
}
module.exports.editGet = (req, res) => {
  let id = req.params.id
  Product.findById(id).then(product => {
    if (!product) {
      return res.sendStatus(404)
    }
    Category.find().then((categories) => {
      res.render('products/edit', {
        product: product,
        categories: categories
      })
    })
  })
}
module.exports.editPost = (req, res) => {
  let id = req.params.id
  let editedProduct = req.body

  Product.findById(id).then((product) => {
    if (!product) {
      return res.redirect(`/?error=${encodeURIComponent('error=Product was not found!')}`)
    }

    product.name = editedProduct.name
    product.description = editedProduct.description
    product.price = editedProduct.price
    if (req.file) {
      fs.unlinkSync(path.normalize(path.join(__dirname, '..', product.image.substr(1)/* Don't ask... */)))
      product.image = '\\' + req.file.path
    }

    if (product.category.toString() !== editedProduct.category) {
      Category.findById(product.category).then((currentCategory) => {
        Category.findById(editedProduct.category).then((nextCategory) => {
          let index = currentCategory.products.indexOf(product._id)
          if (index >= 0) {
            currentCategory.products.splice(index, 1)
          }
          currentCategory.save()

          nextCategory.products.push(product._id)
          nextCategory.save()

          product.category = editedProduct.category

          product.save().then(() => {
            res.redirect(`/?success=${encodeURIComponent('Product was edited successfully!')}`)
          })
        })
      })
    } else {
      product.save().then(() => {
        res.redirect(`/?success=${encodeURIComponent('Product was edited successfully!')}`)
      })
    }
  })
}
module.exports.deleteGet = (req, res) => {
  let id = req.params.id
  Product.findById(id).then(product => {
    if (!product) {
      return res.sendStatus(404)
    }
    res.render('products/delete', {
      product: product
    })
  })
}
module.exports.deletePost = (req, res) => {
  let id = req.params.id
  Product.findByIdAndRemove(id).then((removedProduct) => {
    Category.findById(removedProduct.category).then((currentCategory) => {
      let index = currentCategory.products.indexOf(removedProduct._id)
      if (index >= 0) {
        currentCategory.products.splice(index, 1)
      }
      fs.unlinkSync(path.normalize(path.join(__dirname, '..', removedProduct.image.substr(1)/* Don't ask... */)))
      currentCategory.save().then(() => {
        return res.redirect(`/?success=${encodeURIComponent('Product was deleted successfully!')}`)
      })
    })
  })
}
module.exports.buyGet = (req, res) => {
  let id = req.params.id
  Product.findById(id).then(product => {
    if (!product) {
      return res.sendStatus(404)
    }
    res.render('products/buy', {
      product: product
    })
  })
}
