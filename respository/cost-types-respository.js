const FireStoreRespository = require('./firestore-respository');
const Singleton = require("./singleton");
const DOCS_ID = {
  CONFIG: "Config",
}, COLL_ID = {
  COST_TYPES: "CostTypes",
  PASSWORD: "PASSWORD",
}
module.exports = {
  DOCS_ID,
  COLL_ID,
  getCostTypesAsync: function () {
    console.log("getCostTypesAsync");
    return Singleton.getUserIdAsync()
      .then(userId => {
        return FireStoreRespository.query(`${userId}/${DOCS_ID.CONFIG}`);
      }).then(({ costTypes }) => costTypes);
  },
  setCostTypeAsync: function (data) {
    console.log("setCostTypeAsync", data);
    return Singleton.getUserIdAsync()
      .then(userId => {
        return FireStoreRespository.update(`${userId}/${DOCS_ID.CONFIG}`, { costTypes: data });
      });
  }
}