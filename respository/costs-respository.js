const FireStoreRespository = require('./firestore-respository');
const Singleton = require("./singleton");

module.exports = {
  getDateArrayAsync: function (from, to) {
    return Singleton.getUserIdAsync()
      .then(userId => {
        let filter = (collection) => {
          return collection.where("dateStamp", ">=", from).where("dateStamp", "<=", to);
        };
        return FireStoreRespository.querys(userId, filter);
      });

  },
  getThisDayCostsAsync: function (dateStamp) {
    return Singleton.getUserIdAsync()
      .then(userId => {
        return FireStoreRespository.querys(userId, (collection) => {
          return collection.where("dateStamp", "==", dateStamp);
        });
      });
  },
  insert: function (data) {
    return Singleton.getUserIdAsync()
      .then(userId => {
        return FireStoreRespository.insert(userId, data);
      });
  },
  update: function (data) {
    const { id, ...dataNoId } = data;
    return Singleton.getUserIdAsync()
      .then(userId => {
        return FireStoreRespository.update(`${userId}/${id}`, dataNoId);
      });
  },
  delete: function (data) {
    const { id, ...dataNoId } = data;
    return Singleton.getUserIdAsync()
      .then(userId => {
        return FireStoreRespository.delete(`${userId}/${id}`);
      });
  }
}