const User = require('../data/User')
const Thread = require('../data/Thread')
const Message = require('../data/Message')

module.exports = {
  getMessagesByUsername (req, res) {
    const recipientUsername = req.params.username
    if (req.user.username === recipientUsername) {
      return res.render('errors/selfchat')
    }
    User.findOne({ username: recipientUsername }).then((recipient) => {
      if (!recipient) {
        return res.render('errors/notfound')
      }
      let isBlocked = false
      let iBlockedHim = false
      if (req.user.blockedBy.indexOf(recipient.username) >= 0) {
        isBlocked = true
      }
      if (recipient.blockedBy.indexOf(req.user.username) >= 0) {
        iBlockedHim = true
      }
      Thread.find({ $or: [{ from: req.user._id, to: recipient._id }, { to: req.user._id, from: recipient._id }] })
        .populate('from to content')
        .lean()
        .then((retrievedThreads) => {
          retrievedThreads.map((thread) => {
            thread.content.map(message => {
              if ((message.text.startsWith('http') || message.text.startsWith('https')) &&
                !(message.text.endsWith('.jpg') || message.text.endsWith('.jpeg') || message.text.endsWith('.png'))) {
                message.text = `<a href=${message.text} target="_blank">${message.text}</a>`
              }
              if ((message.text.startsWith('http') || message.text.startsWith('https')) &&
                (message.text.endsWith('.jpg') || message.text.endsWith('.jpeg') || message.text.endsWith('.png'))) {
                message.text = `<img src="${message.text}"/>`
              }
              for (let like of message.likes) {
                if (like.toString() === req.user._id.toString()) {
                  message.islikedByCurrentUser = true
                }
              }
              if (message.sender === req.user.username) {
                message.isMessageMine = true
              }
            })
          })
          res.render('thread/messages', {
            recipient: recipient.username,
            messages: retrievedThreads,
            isBlocked: isBlocked,
            iBlockedHim: iBlockedHim
          })
        })
    })
  },
  sendMessageToUsername (req, res) {
    const sender = req.user
    const messageToSend = req.body.message
    if (messageToSend.length > 1000) {
      return res.render('errors/toolong')
    }
    User.findOne({ username: req.params.recUsername }).then((recipient) => {
      Thread.findOne({ $or: [{ from: req.user._id, to: recipient._id }, { to: req.user._id, from: recipient._id }] }).then((originalThread) => {
        if (!originalThread) {
          Thread.create({
            from: sender._id,
            to: recipient._id
          }).then((createdThread) => {
            Message.create({
              text: messageToSend,
              thread: createdThread._id,
              sender: sender.username
            }).then((createdMessage) => {
              createdThread.content.push(createdMessage._id)
              createdThread.save().then(() => {
                return res.redirect(`/thread/${recipient.username}`)
              })
            })
          })
        } else {
          Message.create({
            text: messageToSend,
            thread: originalThread._id,
            sender: sender.username
          }).then((createdMessage) => {
            originalThread.content.push(createdMessage._id)
            originalThread.save().then(() => {
              return res.redirect(`/thread/${recipient.username}`)
            })
          })
        }
      })
    })
  },
  likeMessage (req, res) {
    Message.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }).then(() => {
      return res.redirect('back')
    })
  },
  unLikeMessage (req, res) {
    Message.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }).then(() => {
      return res.redirect('back')
    })
  }
}
