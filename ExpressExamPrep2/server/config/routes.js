const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)

  app.get('/tweet', auth.isAuthenticated, controllers.tweets.getAddTweetView)
  app.post('/tweet', auth.isAuthenticated, controllers.tweets.addTweet)

  app.get('/tag/:tagName', controllers.tweets.showByTag)
  app.get('/profile/:username', auth.isAuthenticated, controllers.users.getProfile)

  app.get('/edit-tweet/:id', auth.isInRole('Admin'), controllers.tweets.getEditTweetView)
  app.post('/edit-tweet/:id', auth.isInRole('Admin'), controllers.tweets.editTweet)

  app.get('/delete-tweet/:id', auth.isInRole('Admin'), controllers.tweets.getDeleteTweetView)
  app.post('/delete-tweet/:id', auth.isInRole('Admin'), controllers.tweets.deleteTweet)

  app.post('/like-tweet/:id', auth.isAuthenticated, controllers.tweets.likeTweet)
  app.post('/unlike-tweet/:id', auth.isAuthenticated, controllers.tweets.unLikeTweet)

  app.get('/admins/add', auth.isInRole('Admin'), controllers.users.getAddAdminView)
  app.post('/admins/add', auth.isInRole('Admin'), controllers.users.addNewAdmin)

  app.get('/admins/all', auth.isInRole('Admin'), controllers.users.getAllAdminsView)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
