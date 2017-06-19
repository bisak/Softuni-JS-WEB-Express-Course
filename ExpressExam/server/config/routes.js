const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)
  app.get('/thread/:username', auth.isAuthenticated, controllers.threads.getMessagesByUsername)
  app.post('/send-message/:recUsername', auth.isAuthenticated, controllers.threads.sendMessageToUsername)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)

  app.post('/block-user/:username', auth.isAuthenticated, controllers.users.blockUser)
  app.post('/unblock-user/:username', auth.isAuthenticated, controllers.users.unBlockUser)

  app.post('/like-message/:id', auth.isAuthenticated, controllers.threads.likeMessage)
  app.post('/unlike-message/:id', auth.isAuthenticated, controllers.threads.unLikeMessage)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
