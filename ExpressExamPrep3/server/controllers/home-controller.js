const Post = require('../data/Post')
const helper = require('../utilities/helper')
module.exports = {
  index: (req, res) => {
    Post.find().limit(100).sort('-createdAt').populate('creator').then((dbResponse) => {
      let dbres = dbResponse.map(x => x.toObject())
      dbres.map((post) => {
        post.likesCount = post.likes.length
      })
      if (req.user) {
        dbres.map((post) => {
          for (let like of post.likes) {
            if (like.toString() === req.user._id.toString()) {
              post.isLikedByCurrentUser = true
              break
            } else {
              post.isLikedByCurrentUser = false
            }
          }
        })
      }

      dbres = helper.parsePosts(dbres)
      res.render('home/index', { posts: dbres })
    })
  }
}
