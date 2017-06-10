const Post = require('../data/Post')

module.exports = {
  index: (req, res) => {
    Post.find().populate('user').limit(20).sort('-createdAt').then((dbResponse) => {
      let renderData = dbResponse.map(post => post.toObject())
      renderData.map(post => {
        post.singlePostUrl = `/post/${post._id}/${encodeURIComponent(post.title)}`
      })
      return res.render('home/index', { posts: renderData })
    }).catch(err => {
      let firstKey = Object.keys(err.errors)[0]
      res.locals.globalError = err.errors[firstKey].message
      res.render('posts/add')
    })
  },
  about: (req, res) => {
    res.render('home/about')
  }
}
