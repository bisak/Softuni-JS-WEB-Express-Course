const Owner = require('../models/Owner')

module.exports.addGet = (req, res) => {
  res.render('owner/add')
}

module.exports.addPost = (req, res) => {
  let category = req.body
  Owner.create(category).then(() => {
    res.redirect('/')
  })
}

module.exports.productByOwner = (req, res) => {
  let ownerName = req.params.category

  Owner.findOne({ name: ownerName })
    .populate('cars')
    .then((owner) => {
      if (!owner) {
        return res.sendStatus(404)
      }
      res.render('owner/products', { owner: owner })
    })
}
