const Car = require('../models/Car')
const Owner = require('../models/Owner')
const fs = require('fs')
const path = require('path')

module.exports.addGet = (req, res) => {
  Owner.find().then((owners) => {
    res.render('car/add', { owners })
  })
}
module.exports.addPost = (req, res) => {
  let productObj = req.body
  productObj.image = '\\' + req.file.path

  Car.create(productObj).then((insertedProduct) => {
    return Owner.findById(insertedProduct.owner).then(category => {
      console.log(category)
      category.cars.push(insertedProduct._id)
      category.save()
      res.redirect('/')
    })
  }).catch((err) => {
    console.log(err)
  })
}
module.exports.editGet = (req, res) => {
  let id = req.params.id
  Car.findById(id).then(car => {
    if (!car) {
      return res.sendStatus(404)
    }
    Owner.find().then((owners) => {
      res.render('car/edit', {
        car: car,
        owners: owners
      })
    })
  })
}
module.exports.editPost = (req, res) => {
  let id = req.params.id
  let editedProduct = req.body

  Car.findById(id).then((car) => {
    if (!car) {
      return res.redirect(`/?error=${encodeURIComponent('error=Car was not found!')}`)
    }

    car.model = editedProduct.model
    car.description = editedProduct.description
    if (req.file) {
      fs.unlinkSync(path.normalize(path.join(__dirname, '..', car.image.substr(1)/* Don't ask... */)))
      car.image = '\\' + req.file.path
    }

    if (car.owner.toString() !== editedProduct.owner) {
      Owner.findById(car.owner).then((currentOwner) => {
        Owner.findById(editedProduct.owner).then((nextOwner) => {
          let index = currentOwner.cars.indexOf(car._id)
          console.log(car)
          if (index >= 0) {
            currentOwner.cars.splice(index, 1)
          }
          currentOwner.save()

          nextOwner.cars.push(car._id)
          nextOwner.save()

          car.owner = editedProduct.owner

          car.save().then(() => {
            res.redirect(`/?success=${encodeURIComponent('Product was edited successfully!')}`)
          })
        })
      })
    } else {
      console.log(car)
      car.save().then(() => {
        res.redirect(`/?success=${encodeURIComponent('Product was edited successfully!')}`)
      })
    }
  })
}
module.exports.deleteGet = (req, res) => {
  let id = req.params.id
  Car.findById(id).then(car => {
    if (!car) {
      return res.sendStatus(404)
    }
    res.render('car/delete', {
      car
    })
  })
}
module.exports.deletePost = (req, res) => {
  let id = req.params.id
  Car.findByIdAndRemove(id).then((removedCar) => {
    Owner.findById(removedCar.owner).then((owner) => {
      let index = owner.cars.indexOf(removedCar._id)
      if (index >= 0) {
        owner.cars.splice(index, 1)
      }
      fs.unlinkSync(path.normalize(path.join(__dirname, '..', removedCar.image.substr(1)/* Don't ask... */)))
      owner.save().then(() => {
        return res.redirect(`/?success=${encodeURIComponent('Product was deleted successfully!')}`)
      })
    })
  })
}
module.exports.getSinglePost = (req, res) => {
  let { id } = req.params
  Car.findById(id).then(car => {
    console.log(car)
    res.render('car/single', { car })
  })
}
