module.exports = {
  randomString: function () {
    var text = [];
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 20; i++)
      text.push(possible.charAt(Math.floor(Math.random() * possible.length)));

    return text.join('');
  }
}