const Article = require('../data/Article')

function prepareArticlesToSend (articles, user) {
  if (user) {
    if (articles instanceof Array) {
      articles.map(article => {
        if (article.creator.equals(user._id) || user.username === 'Admin') {
          article.canEdit = true
        }
      })
    } else {
      if (articles.creator.equals(user._id) || user.username === 'Admin') {
        articles.canEdit = true
      }
    }
  }
  return articles
}

module.exports = {
  getCreateArticleView: (req, res) => {
    res.render('article/create')
  },
  getAllArticles: (req, res) => {
    const { user } = req

    Article.find().sort('-updatedAt').then((dbResponse) => {
      let dbResponseToSend = dbResponse.map(article => article.toObject())
      dbResponseToSend = prepareArticlesToSend(dbResponseToSend, user)
      return res.render('article/list', {
        articles: dbResponseToSend
      })
    }).catch((dbError) => {
      console.log(dbError)
      res.locals.globalError = 'An error occured when creating an article.'
      return res.render('home/index')
    })
  },
  addNewArticle: (req, res) => {
    let articleToSave = {
      title: req.body.title,
      content: req.body.content,
      creator: req.user._id
    }
    Article.create(articleToSave).then((dbResponse) => {
      return res.redirect('/article/list')
    }).catch((dbError) => {
      console.log(dbError)
      res.locals.globalError = 'An error occured when creating an article.'
      return res.render('home/index')
    })
  },
  getSingleArticle: (req, res) => {
    const { id } = req.params
    const { user } = req

    Article.findById(id).then((dbResponse) => {
      let dbResponseToSend = dbResponse.toObject()
      dbResponseToSend = prepareArticlesToSend(dbResponseToSend, user)
      return res.render('article/single', { article: dbResponseToSend })
    }).catch((dbError) => {
      console.log(dbError)
      res.locals.globalError = 'An error occured when requesting an article.'
      return res.render('home/index')
    })
    console.log()
  },
  editArticle: (req, res) => {
    const { id } = req.params
    let editData = req.body
    Article.findByIdAndUpdate(id, editData).then((dbResponse) => {
      return res.redirect('/article/list')
    }).catch((dbError) => {
      console.log(dbError)
      res.locals.globalError = 'An error occured when requesting an article.'
      return res.render('home/index')
    })
  },
  getEditView: (req, res) => {
    const { id } = req.params
    Article.findById(id).then((dbResponse) => {
      return res.render('article/edit', { article: dbResponse })
    }).catch((dbError) => {
      console.log(dbError)
      res.locals.globalError = 'An error occured when requesting an article.'
      return res.render('home/index')
    })
  },
  deleteArticle: (req, res) => {
    const { id } = req.params
    Article.findByIdAndRemove(id).then((dbResponse) => {
      res.redirect('/article/list')
    }).catch((dbError) => {
      console.log(dbError)
      res.locals.globalError = 'An error occured when requesting an article.'
      return res.render('home/index')
    })
  }
}
