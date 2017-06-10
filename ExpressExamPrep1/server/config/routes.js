const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)
  app.get('/about', auth.isAuthenticated, controllers.home.about)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)
  app.get('/add', auth.isAuthenticated, controllers.posts.getPostView)
  app.post('/add', auth.isAuthenticated, controllers.posts.addPost)
  app.get('/list', controllers.posts.renderPosts)
  app.get('/post/edit/:id', auth.isInRole('Admin'), controllers.posts.getEditView)
  app.post('/post/edit/:id', auth.isInRole('Admin'), controllers.posts.editPost)
  app.get('/post/delete/:id', auth.isInRole('Admin'), controllers.posts.getDeleteView)
  app.post('/post/delete/:id', auth.isInRole('Admin'), controllers.posts.deletePost)
  app.get('/edit-answer/:id', auth.isInRole('Admin'), controllers.posts.getEditAnswerView)
  app.post('/edit-answer/:id', auth.isInRole('Admin'), controllers.posts.editAnswer)
  app.get('/delete-answer/:id', auth.isInRole('Admin'), controllers.posts.getDeleteAnswerView)
  app.post('/delete-answer/:id', auth.isInRole('Admin'), controllers.posts.deleteAnswer)
  app.get('/post/:id/:title', controllers.posts.getSinglePostView)
  app.post('/post/:id/:title', auth.isAuthenticated, controllers.posts.setAnswer)
  app.get('/profile/:username', controllers.users.getUserProfile)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
