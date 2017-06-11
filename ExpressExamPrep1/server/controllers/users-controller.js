const encryption = require('../utilities/encryption')
const User = require('mongoose').model('User')
const Post = require('mongoose').model('Post')
const Answer = require('mongoose').model('Answer')

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
    User
      .findOne({ username: reqUser.username }).then(user => {
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
  getUserProfile: (req, res) => {
    const { username } = req.params
    User.findOne({ username }).then((userData) => {
      return Promise.all([Post.find({ user: userData._id }), Answer.find({ user: userData._id })]).then((userAdditionalData) => {
        let postData = userAdditionalData[0]
        let answerData = userAdditionalData[1]
        return res.render('users/profile', { answerData: answerData, userPosts: postData, userData: userData })
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
  },
  blockUser (req, res) {
    const { id } = req.params
    User.findByIdAndUpdate(id, { isBlocked: true }).then((dbResponse) => {
      return res.redirect('back')
    })
  },
  unBlockUser (req, res) {
    const { id } = req.params
    User.findByIdAndUpdate(id, { isBlocked: false }).then((dbResponse) => {
      return res.redirect('back')
    })
  }
}
