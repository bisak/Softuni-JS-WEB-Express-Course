const encryption = require('../utilities/encryption')
const User = require('mongoose').model('User')
const Post = require('../data/Post')
const helper = require('../utilities/helper')

module.exports = {
  registerGet: (req, res) => {
    res.render('users/register')
  },
  registerPost: (req, res) => {
    let reqUser = req.body
    // Add validations!

    let salt = encryption.generateSalt()
    let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password)

    User.create({
      username: reqUser.username,
      firstName: reqUser.firstName,
      lastName: reqUser.lastName,
      salt: salt,
      hashedPass: hashedPassword
    }).then(user => {
      req.logIn(user, (err, user) => {
        if (err) {
          res.locals.globalError = err
          res.render('users/register', user)
        }

        res.redirect('/')
      })
    })
  },
  loginGet: (req, res) => {
    res.render('users/login')
  },
  loginPost: (req, res) => {
    let reqUser = req.body
    User.findOne({ username: reqUser.username }).then(user => {
      if (!user) {
        res.locals.globalError = 'Invalid user data'
        res.render('users/login')
        return
      }

      if (!user.authenticate(reqUser.password)) {
        res.locals.globalError = 'Invalid user data'
        res.render('users/login')
        return
      }

      req.logIn(user, (err, user) => {
        if (err) {
          res.locals.globalError = err
          res.render('users/login')
        }

        res.redirect('/')
      })
    })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },
  getProfile (req, res) {
    User.findOne({ username: req.params.username }).then((user) => {
      if (!user) {
        return res.render('home/404')
      }
      return Post.find({ creator: user._id }).limit(100).sort('-createdAt').populate('creator').then((postsRes) => {
        return Post.find({ description: new RegExp(`@${req.params.username}`, 'ig') }).limit(100).sort('-createdAt').populate('creator').then((mentionsRes) => {
          let posts = postsRes.map(x => x.toObject())
          let mentions = mentionsRes.map(x => x.toObject())
          posts.map((post) => {
            post.likesCount = post.likes.length
          })
          mentions.map((mention) => {
            mention.likesCount = mention.likes.length
          })
          if (req.user) {
            posts.map((post) => {
              for (let like of post.likes) {
                if (like.toString() === req.user._id.toString()) {
                  post.isLikedByCurrentUser = true
                  break
                } else {
                  post.isLikedByCurrentUser = false
                }
              }
            })
            mentions.map((mention) => {
              for (let like of mention.likes) {
                if (like.toString() === req.user._id.toString()) {
                  mention.isLikedByCurrentUser = true
                  break
                } else {
                  mention.isLikedByCurrentUser = false
                }
              }
            })
          }
          mentions = helper.parsePosts(mentions)
          posts = helper.parsePosts(posts)
          return res.render('users/profile', { user: user, posts: posts, mentions: mentions })
        })
      })
    })
  },
  getAddAdminView (req, res) {
    User.find({ roles: { $nin: ['Admin'] } }).then((dbResponse) => {
      res.render('users/addAdmin', { users: dbResponse })
    })
  },
  addNewAdmin (req, res) {
    let candidateAdminId = req.body.candidateAdmin
    User.findOneAndUpdate({ _id: candidateAdminId }, { $push: { roles: 'Admin' } }).then((dbResponse) => {
      res.redirect('/')
    })
  },
  getAllAdminsView (req, res) {
    User.find({ roles: 'Admin' }).then((dbResponse) => {
      res.render('users/allAdmins', { admins: dbResponse })
    })
  }
}
