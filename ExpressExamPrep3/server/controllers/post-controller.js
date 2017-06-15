const Post = require('../data/Post')
const helper = require('../utilities/helper')

module.exports = {
  getAddPostView (req, res) {
    return res.render('posts/add')
  },
  addPost (req, res) {
    let objToSave = {
      description: req.body.description,
      creator: req.user._id,
      image: req.body.image
    }
    Post.create(objToSave).then((dbResponse) => {
      return res.redirect('/')
    })
  },
  showByTag (req, res) {
    const { tagName } = req.params
    Post.find({ description: new RegExp(`#${tagName}`, 'ig') }).limit(100).sort('-createdAt').populate('creator').then((dbResponse) => {
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
      return res.render('posts/AllByTag', { posts: dbres, tagName: tagName })
    })
  },
  getEditpostView (req, res) {
    Post.findById(req.params.id).then((dbResponse) => {
      return res.render('posts/edit', dbResponse)
    })
  },
  editpost (req, res) {
    const {description} = req.body
    Post.findByIdAndUpdate(req.params.id, {description}).then((dbResponse) => {
      return res.redirect('/')
    })
  },
  getDeletepostView (req, res) {
    Post.findById(req.params.id).then((dbResponse) => {
      return res.render('posts/delete', dbResponse)
    })
  },
  deletepost (req, res) {
    Post.findByIdAndRemove(req.params.id).then((dbResponse) => {
      return res.redirect('/')
    })
  },
  likepost (req, res) {
    const { id } = req.params
    Post.findOneAndUpdate({ _id: id }, { $addToSet: { likes: req.user._id } }).then((dbResponse) => {
      return res.redirect('back')
    })
  },
  unLikepost (req, res) {
    const { id } = req.params
    Post.findOneAndUpdate({ _id: id }, { $pull: { likes: req.user._id } }).then((dbResponse) => {
      return res.redirect('back')
    })
  }
}
