const Tweet = require('../data/Tweet')
const helper = require('../utilities/helper')

module.exports = {
  getAddTweetView (req, res) {
    return res.render('tweets/add')
  },
  addTweet (req, res) {
    let objToSave = {
      content: req.body.content,
      creator: req.user._id
    }
    Tweet.create(objToSave).then((dbResponse) => {
      return res.redirect('/')
    })
  },
  showByTag (req, res) {
    const { tagName } = req.params
    Tweet.find({ content: new RegExp(`#${tagName}`, 'ig') }).limit(100).sort('-createdAt').populate('creator').then((dbResponse) => {
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
      return res.render('tweets/AllByTag', { tweets: dbres, tagName: tagName })
    })
  },
  getEditTweetView (req, res) {
    Tweet.findById(req.params.id).then((dbResponse) => {
      return res.render('tweets/edit', dbResponse)
    })
  },
  editTweet (req, res) {
    const {content} = req.body
    Tweet.findByIdAndUpdate(req.params.id, {content}).then((dbResponse) => {
      return res.redirect('/')
    })
  },
  getDeleteTweetView (req, res) {
    Tweet.findById(req.params.id).then((dbResponse) => {
      return res.render('tweets/delete', dbResponse)
    })
  },
  deleteTweet (req, res) {
    Tweet.findByIdAndRemove(req.params.id).then((dbResponse) => {
      return res.redirect('/')
    })
  },
  likeTweet (req, res) {
    const { id } = req.params
    Tweet.findOneAndUpdate({ _id: id }, { $addToSet: { likes: req.user._id } }).then((dbResponse) => {
      return res.redirect('back')
    })
  },
  unLikeTweet (req, res) {
    const { id } = req.params
    Tweet.findOneAndUpdate({ _id: id }, { $pull: { likes: req.user._id } }).then((dbResponse) => {
      return res.redirect('back')
    })
  }
}
