const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)

  app.get('/add', auth.isAuthenticated, controllers.posts.getAddPostView)
  app.post('/add', auth.isAuthenticated, controllers.posts.addPost)

  app.get('/tag/:tagName', controllers.posts.showByTag)
  app.get('/profile/:username', auth.isAuthenticated, controllers.users.getProfile)

  app.get('/edit-post/:id', auth.isInRole('Admin'), controllers.posts.getEditpostView)
  app.post('/edit-post/:id', auth.isInRole('Admin'), controllers.posts.editpost)

  app.get('/delete-post/:id', auth.isInRole('Admin'), controllers.posts.getDeletepostView)
  app.post('/delete-post/:id', auth.isInRole('Admin'), controllers.posts.deletepost)

  app.post('/like-post/:id', auth.isAuthenticated, controllers.posts.likepost)
  app.post('/unlike-post/:id', auth.isAuthenticated, controllers.posts.unLikepost)

  app.get('/admins/add', auth.isInRole('Admin'), controllers.users.getAddAdminView)
  app.post('/admins/add', auth.isInRole('Admin'), controllers.users.addNewAdmin)

  app.get('/admins/all', auth.isInRole('Admin'), controllers.users.getAllAdminsView)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
