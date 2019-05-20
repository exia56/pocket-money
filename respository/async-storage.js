const AsyncStorage = require('@react-native-community/async-storage').default;
const STORAGE_KEY = {
  get USER_ID() { return "USER_ID"; }, //
  get COST_TYPE() { return "COST_TYPE"; }, //
}
module.exports = {
  get STORAGE_KEY() {
    return STORAGE_KEY;
  },
  getAllStorageKey: () => {
    return AsyncStorage.getAllKeys();
  },
  getStorageItem: (key) => {
    return AsyncStorage.getItem(key);
  },
  setStorageItem: (key, data) => {
    return AsyncStorage.setItem(key, data);
  },
  removeStorageItem: (key) => {
    return AsyncStorage.removeItem(key);
  },
  removeStorageItems: (multiKey) => {
    return AsyncStorage.multiRemove(multiKey);
  },
  clearStorageItem: () => {
    return AsyncStorage.getAllKeys()
      .then(keys => {
        console.log(keys);
        if (keys.length > 0)
          return AsyncStorage.multiRemove(keys);
        else return true;
      });
  },
  // resetStorageItem: () => {
  //   return AsyncStorage.clear();
  // }
}
