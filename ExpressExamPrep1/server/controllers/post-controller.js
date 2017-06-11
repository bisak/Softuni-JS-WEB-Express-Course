const Post = require('../data/Post')
const Answer = require('../data/Answer')
const Category = require('../data/Category')
const User = require('../data/User')

module.exports = {
  getPostView (req, res) {
    Category.find().then((dbResponse) => {
      return res.render('posts/add', { categories: dbResponse })
    })
  },
  addPost (req, res) {
    User.findById(req.user._id).then((dbUserResponse) => {
      if (dbUserResponse.isBlocked) {
        return res.render('users/blocked')
      }
      let postToAdd = req.body
      postToAdd.user = req.user._id
      return Post.create(postToAdd).then((dbResponse) => {
        return Category.findOneAndUpdate({ _id: postToAdd.category }, { $addToSet: { posts: dbResponse._id } }).then((catAddResponse) => {
          return res.redirect('/list')
        })
      })
    }).catch(err => {
      let firstKey = Object.keys(err.errors)[0]
      res.locals.globalError = err.errors[firstKey].message
      res.render('posts/add')
    })
  },
  renderPosts (req, res) {
    const PAGE_SIZE = 2
    let page = parseInt(req.query.page) || 1

    Post.find()
      .populate('user')
      .sort('-createdAt')
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .then((dbResponse) => {
        let renderData = dbResponse.map(post => post.toObject())
        renderData.map(post => {
          post.singlePostUrl = `/post/${post._id}/${encodeURIComponent(post.title)}`
        })
        return res.render('posts/list', {
          posts: renderData,
          hasPrevPage: page > 1,
          hasNextPage: renderData.length > 0,
          prevPage: page - 1,
          nextPage: page + 1
        })
      })
  },
  renderPostsForCategory (req, res) {
    Category.findOne({ name: req.params.category }).populate({
      path: 'posts',
      options: { sort: '-createdAt' }
    }).then((dbResponse) => {
      if (dbResponse) {
        let renderData = dbResponse.toObject()
        return res.render('category/posts', renderData)
      }
      return res.redirect('back')
    })
  },
  getSinglePostView (req, res) {
    let postId = req.params.id
    let postTitle = req.params.title
    Post.findOneAndUpdate({ _id: postId }, { $inc: { views: 1 } }).exec()
    Post.findOne({ _id: postId, title: postTitle }).deepPopulate('user answers.user').then((dbResponse) => {
      let renderData = dbResponse.toObject()
      renderData.likesCount = renderData.likes.length
      if (req.user) {
        for (let like of renderData.likes) {
          if (like.toString() === req.user._id.toString()) {
            renderData.isLikedByCurrentUser = true
            break
          } else {
            renderData.isLikedByCurrentUser = false
          }
        }
      }
      return res.render('posts/single', renderData)
    }).catch(err => {
      let firstKey = Object.keys(err.errors)[0]
      res.locals.globalError = err.errors[firstKey].message
      res.redirect('/list')
    })
  },
  setAnswer (req, res) {
    let postId = req.params.id
    let answer = req.body
    answer.user = req.user._id
    User.findById(req.user._id).then((dbUserResponse) => {
      if (dbUserResponse.isBlocked) {
        return res.render('users/blocked')
      }
      return Answer.create(answer).then((dbAnswerResponse) => {
        return Post.findOneAndUpdate({ _id: postId }, { $addToSet: { answers: dbAnswerResponse._id } }).then((dbResponse) => {
          return res.redirect('back')
        })
      })
    }).catch(err => {
      let firstKey = Object.keys(err.errors)[0]
      res.locals.globalError = err.errors[firstKey].message
      res.redirect('/list')
    })
  },
  getEditView (req, res) {
    const { id } = req.params
    Post.findById(id).then((dbResponse) => {
      return res.render('posts/edit', dbResponse)
    }).catch(err => {
      let firstKey = Object.keys(err.errors)[0]
      res.locals.globalError = err.errors[firstKey].message
      res.redirect('/list')
    })
  },
  editPost (req, res) {
    const { id } = req.params
    let postToAdd = req.body
    Post.findByIdAndUpdate(id, postToAdd).then((dbResponse) => {
      return res.redirect('/list')
    }).catch(err => {
      let firstKey = Object.keys(err.errors)[0]
      res.locals.globalError = err.errors[firstKey].message
      res.render('posts/add')
    })
  },
  getDeleteView (req, res) {
    return res.render('posts/delete')
  },
  deletePost (req, res) {
    const { id } = req.params
    Post.findOneAndRemove({ _id: id }).then((dbResponse) => {
      return Answer.remove({ _id: dbResponse.answers }).then((dbAnswersResponse) => {
        return res.redirect('/list')
      })
    }).catch(err => {
      let firstKey = Object.keys(err.errors)[0]
      res.locals.globalError = err.errors[firstKey].message
      res.redirect('/list')
    })
  },
  getEditAnswerView (req, res) {
    const { id } = req.params
    Answer.findById(id).then((dbResponse) => {
      return res.render('posts/editAnswer', dbResponse)
    }).catch(err => {
      let firstKey = Object.keys(err.errors)[0]
      res.locals.globalError = err.errors[firstKey].message
      res.redirect('/list')
    })
  },
  editAnswer (req, res) {
    const { id } = req.params
    const answer = req.body
    Answer.findOneAndUpdate({ _id: id }, answer).then((dbResponse) => {
      return res.redirect('/list')
    }).catch(err => {
      let firstKey = Object.keys(err.errors)[0]
      res.locals.globalError = err.errors[firstKey].message
      res.redirect('/list')
    })
  },
  getDeleteAnswerView (req, res) {
    return res.render('posts/delete')
  },
  deleteAnswer (req, res) {
    const { id } = req.params
    return Answer.remove({ _id: id }).then((dbAnswersResponse) => {
      return res.redirect('/list')
    }).catch(err => {
      let firstKey = Object.keys(err.errors)[0]
      res.locals.globalError = err.errors[firstKey].message
      res.redirect('/list')
    })
  },
  likePost (req, res) {
    const { id } = req.params
    Post.findOneAndUpdate({ _id: id }, { $addToSet: { likes: req.user._id } }).then((dbResponse) => {
      res.redirect('back')
    })
  },
  unLikePost (req, res) {
    const { id } = req.params
    Post.findOneAndUpdate({ _id: id }, { $pull: { likes: req.user._id } }).then((dbResponse) => {
      res.redirect('back')
    })
  }
}
