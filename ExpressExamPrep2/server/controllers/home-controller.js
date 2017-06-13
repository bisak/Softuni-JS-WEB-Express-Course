const Tweet = require('../data/Tweet')
const helper = require('../utilities/helper')
module.exports = {
  index: (req, res) => {
    Tweet.find().limit(100).sort('-createdAt').populate('creator').then((dbResponse) => {
      let dbres = dbResponse.map(x => x.toObject())
      dbres.map((tweet) => {
        tweet.likesCount = tweet.likes.length
      })
      if (req.user) {
        dbres.map((tweet) => {
          for (let like of tweet.likes) {
            if (like.toString() === req.user._id.toString()) {
              tweet.isLikedByCurrentUser = true
              break
            } else {
              tweet.isLikedByCurrentUser = false
            }
          }
        })
      }

      dbres = helper.parseTweets(dbres)
      res.render('home/index', { tweets: dbres })
    })
  }
}
