module.exports.parseTweets = function (tweets) {
  tweets.map(function (tweet) {
    tweet.content = tweet.content.replace(/<\/script>/ig, '')
    tweet.content = tweet.content.replace(/<script>/ig, '')
    tweet.content = tweet.content.replace(/(#[a-z0-9][a-z0-9\-_]*)/ig, function (x) {
      return `<a href="/tag/${x.substr(1)}">${x}</a>`
    })
    tweet.content = tweet.content.replace(/(@[a-z0-9][a-z0-9\-_]*)/ig, function (x) {
      return `<a href="/profile/${x.substr(1)}">${x}</a>`
    })
  })
  return tweets
}
