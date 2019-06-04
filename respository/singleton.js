let singleton = {
  USER_ID: ""
};

function checkIsUserId(userId) {
  return userId && userId.length >= 20;
}

module.exports = {
  setUserIdAsync: function (userId) {
    return new Promise((resolve, reject) => {
      singleton.USER_ID = userId
      return resolve();
    })
  },
  getUserIdAsync: function () {
    return new Promise((resolve, reject) => {
      if (!checkIsUserId(singleton.USER_ID)) return reject(new Error("call setUserId() before use firestore"));
      resolve(singleton.USER_ID);
    })

  },
  isSetUserId: function () {
    return checkIsUserId(singleton.USER_ID);
  },
  checkIsUserId
}
