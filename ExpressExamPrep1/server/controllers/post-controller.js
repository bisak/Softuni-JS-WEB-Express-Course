const Post = require('../data/Post')
const Answer = require('../data/Answer')

module.exports = {
  getPostView (req, res) {
    return res.render('posts/add')
  },
  addPost (req, res) {
    let postToAdd = req.body
    postToAdd.user = req.user._id
    Post.create(postToAdd).then((dbResponse) => {
      return res.redirect('/list')
    }).catch(err => {
      let firstKey = Object.keys(err.errors)[0]
      res.locals.globalError = err.errors[firstKey].message
      res.render('posts/add')
    })
  },
  renderPosts (req, res) {
    Post.find().populate('user').sort('-createdAt').then((dbResponse) => {
      let renderData = dbResponse.map(post => post.toObject())
      renderData.map(post => {
        post.singlePostUrl = `/post/${post._id}/${encodeURIComponent(post.title)}`
      })
      return res.render('posts/list', { posts: renderData })
    }).catch(err => {
      let firstKey = Object.keys(err.errors)[0]
      res.locals.globalError = err.errors[firstKey].message
      res.render('posts/add')
    })
  },
  getSinglePostView (req, res) {
    let postId = req.params.id
    let postTitle = req.params.title
    Post.findOne({ _id: postId, title: postTitle })
      .deepPopulate('user answers.user').then((dbResponse) => {
      return res.render('posts/single', dbResponse)
    }).catch(err => {
      let firstKey = Object.keys(err.errors)[0]
      res.locals.globalError = err.errors[firstKey].message
      res.redirect('/list')
    })
  },
  setAnswer (req, res) {
    let postId = req.params.id
    let postTitle = req.params.title
    let answer = req.body
    answer.user = req.user._id

    Answer.create(answer).then((dbAnswerResponse) => {
      return Post.findOneAndUpdate({ _id: postId }, { $addToSet: { answers: dbAnswerResponse._id } }).then((dbResponse) => {
        return res.redirect('back')
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
  }
}
