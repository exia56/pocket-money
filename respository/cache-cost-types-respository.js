const AsyncStorage = require('./async-storage');
const STORAGE_KEY = AsyncStorage.STORAGE_KEY;

module.exports = {
  getCostTypesAsync: function () {
    return AsyncStorage.getStorageItem(STORAGE_KEY.COST_TYPE)
      .then(data => JSON.parse(data));
  },
  setCostTypeAsync: function (data) {
    return AsyncStorage.setStorageItem(STORAGE_KEY.COST_TYPE, JSON.stringify(data));
  }
}