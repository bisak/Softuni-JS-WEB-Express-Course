const Car = require('../models/Car')

module.exports.index = (req, res) => {
  let queryData = req.query
  Car.find().populate('owner').then((products) => {
    if (queryData.query) {
      products = products.filter(x => (x.model.toLowerCase().includes(queryData.query.toLowerCase())) || (x.description.toLowerCase().includes(queryData.query.toLowerCase())))
    }
    let data = { products: products }
    if (req.query.error) {
      data.error = req.query.error
    } else if (req.query.success) {
      data.success = req.query.success
    }
    res.render('home/index', data)
  })
}
