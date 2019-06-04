const AsyncStorage = require("./async-storage");
const STORAGE_KEY = AsyncStorage.STORAGE_KEY;
const FireStoreRespository = require('./firestore-respository');
const Singleton = require("./singleton");
const CostTypeRespository = require('./cost-types-respository');

const COLL_ID = CostTypeRespository.COLL_ID;
const DOCS_ID = CostTypeRespository.DOCS_ID;

module.exports = {
  getUserId: function () {
    return AsyncStorage.getStorageItem(STORAGE_KEY.USER_ID);
  },
  saveUserId: function (id) {
    console.log(STORAGE_KEY.USER_ID, id)
    return AsyncStorage.setStorageItem(STORAGE_KEY.USER_ID, id).then(() => id);
  },
  removeUserId: function () {
    return AsyncStorage.removeStorageItem(STORAGE_KEY.USER_ID);
  },
}