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
  app.get('/article/list', controllers.article.getAllArticles)
  app.get('/article/add', auth.isAuthenticated, controllers.article.getCreateArticleView)
  app.post('/article/add', auth.isAuthenticated, controllers.article.addNewArticle)
  app.get('/article/details/:id', auth.isAuthenticated, controllers.article.getSingleArticle)
  app.post('/article/edit/:id', auth.isAuthenticated, controllers.article.editArticle)
  app.get('/article/edit/:id', auth.isAuthenticated, controllers.article.getEditView)
  app.post('/article/delete/:id', auth.isAuthenticated, controllers.article.deleteArticle)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
