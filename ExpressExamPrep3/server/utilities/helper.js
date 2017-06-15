module.exports.parsePosts = function (posts) {
  posts.map(function (post) {
    post.description = post.description.replace(/<\/script>/ig, '')
    post.description = post.description.replace(/<script>/ig, '')
    post.description = post.description.replace(/(#[a-z0-9][a-z0-9\-_]*)/ig, function (x) {
      return `<a href="/tag/${x.substr(1)}">${x}</a>`
    })
    post.description = post.description.replace(/(@[a-z0-9][a-z0-9\-_]*)/ig, function (x) {
      return `<a href="/profile/${x.substr(1)}">${x}</a>`
    })
  })
  return posts
}
