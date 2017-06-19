const User = require('../data/User')
const Thread = require('../data/Thread')

module.exports = {
  index: (req, res) => {
    const search = req.query.search
    if (search && req.user) {
      User.find({ username: new RegExp(search, 'i') }).then((dbResponse) => {
        return res.render('home/index', { users: dbResponse })
      })
    } else if (req.user) {
      Thread.find({ $or: [{ from: req.user._id }, { to: req.user._id }] })
      .populate('from to')
      .lean()
      .sort('-updatedAt')
      .then((retrievedThreads) => {
        retrievedThreads.map(thread => {
          if ((thread.from._id.toString() === req.user._id.toString())) {
            delete thread.from
          } else if ((thread.to._id.toString() === req.user._id.toString())) {
            delete thread.to
          }
        })
        res.render('home/index', {threads: retrievedThreads})
      })
    } else {
      res.render('home/index', {})
    }
  }
}
