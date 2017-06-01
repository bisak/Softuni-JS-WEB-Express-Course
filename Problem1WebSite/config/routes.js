const handlers = require('../handlers')
const multer = require('multer')
let upload = multer({ dest: './content/images' })

module.exports = (app) => {
  app.get('/', handlers.home.index)

  app.get('/product/add', handlers.car.addGet)
  app.post('/product/add', upload.single('image'), handlers.car.addPost)

  app.get('/category/add', handlers.owner.addGet)
  app.post('/category/add', handlers.owner.addPost)

  app.get('/category/:category/products', handlers.owner.productByOwner)

  app.get('/product/edit/:id', handlers.car.editGet)
  app.post('/product/edit/:id', upload.single('image'), handlers.car.editPost)

  app.get('/product/delete/:id', handlers.car.deleteGet)
  app.post('/product/delete/:id', handlers.car.deletePost)
  app.get('/car-view/:id', handlers.car.getSinglePost)
}
