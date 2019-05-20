const errSymbol = Symbol();
module.exports = {
  wrapTimeout: function (promise, timeout = 500) {
    return new Promise((resolve, reject) => {
      const tick = setTimeout(() => {
        console.log('reject', promise, timeout, tick);
        reject(this.TimeoutError)
      }, timeout);
      console.log(promise, timeout, tick);
      promise.then((...args) => {
        console.log('done', promise, timeout, tick);
        clearTimeout(tick);
        resolve(...args);
      })
    })
  },
  get TimeoutError() {
    return errSymbol;
  }
}