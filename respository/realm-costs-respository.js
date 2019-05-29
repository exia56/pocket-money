const LocalStoreRespository = require('./realm-respository');
const {
  COLL_COST,
} = LocalStoreRespository;
const pageLimit = 20;

module.exports = {
  pull: function () {
    return LocalStoreRespository.querys(COLL_COST);
  },
  getDateArrayAsync: function (from, to) {
    let filter = (collection) => {
      return collection.filtered(`dateStamp >= ${from} && dateStamp <= ${to}`);
    };
    return LocalStoreRespository.querys(COLL_COST, filter);
  },
  getThisDayCostsAsync: function (dateStamp, page) {
    let filter = (collection) => {
      const start = page * pageLimit;
      return collection.filtered(`dateStamp = ${dateStamp}`).slice(start, start + pageLimit);
    };
    return LocalStoreRespository.querys(COLL_COST, filter);
  },
  queryDetails: function (str, page) {
    let filter = (collection) => {
      return collection.filtered(`detail LIKE *${str}*`);
    };
    return LocalStoreRespository.querys(COLL_COST, filter);
  },
  insert: function (data) {
    return LocalStoreRespository.insert(COLL_COST, data);
  },
  insertMany: function (datas) {
    return LocalStoreRespository.insertMany(COLL_COST, datas);
  },
  update: function (data) {
    return LocalStoreRespository.update(COLL_COST, data);
  },
  delete: function (data) {
    const { id } = data;
    return LocalStoreRespository.delete(COLL_COST, id);
  },
  empty: function () {
    return LocalStoreRespository.empty();
  }
}