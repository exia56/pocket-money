const crypto = require("crypto");
const CacheUserRespository = require("../respository/cache-user-respository");
const RealmCostRespository = require("../respository/realm-costs-respository");
const Singleton = require("../respository/singleton");

module.exports = {
  generateUserId: function (key1, key2) {
    const sha = crypto.createHash("md5");
    sha.update(`${key1}##${key2}`)
    const result = sha.digest('hex');
    return result;
  },
  initialUserDataAsync: function (userId) {
    return Promise.all([
      Singleton.setUserIdAsync(userId),
      CacheUserRespository.saveUserId(userId).then(res => res),
    ]);
  },
  setUserIdAsync: function (userId) {
    if (Singleton.checkIsUserId(userId))
      return CacheUserRespository.saveUserId(userId)
        .then(res => res);
    else return Promise.reject(new Error("userId worng format"));
  },
  getUserIdAsync: function () {
    return CacheUserRespository.getUserId();
  },
  removeUserIdAsync: function () {
    Singleton.setUserIdAsync("");
    RealmCostRespository.empty();
    return CacheUserRespository.removeUserId();
  },
}