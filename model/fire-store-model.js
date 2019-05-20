const FireStoreRespository = require("../respository/firestore-respository");

type DataModal = {
  id: String,
  amount: Number,
  dateStamp: Number,//YYYMMDD
  day: Number,
  detail: String,
  month: Number,
  type: Number,
  year: Number
}
let USER_ID = "";

module.exports = {
  isSetUserId: function () {
    console.log("USER_ID", USER_ID);
    return checkUserId();
  },
  setUserId: function (userId) {
    USER_ID = userId;
  },
  getMonthlyCosts: function (dayArray) {
    if (!checkUserId()) return Promise.reject(new Error("call setUserId() before use firestore"));
    let from = dayArray[0].dateStamp,
      to = dayArray[dayArray.length - 1].dateStamp;
    return FireStoreRespository.queryMonthlyCosts(from, to, USER_ID)
      .then(data => {
        let d = sumEachDayAmount(data),
          monthly = 0,
          monthStart = dayArray[dayArray.length / 2].dateStamp - 20,
          monthEnd = dayArray[dayArray.length / 2].dateStamp + 20;
        dayArray.forEach(v => {
          v.amount = d[v.dateStamp] || 0;
          if (v.dateStamp >= monthStart && v.dateStamp <= monthEnd)
            monthly += v.amount;
        });
        return { dayArray, monthly };
      });
  },
  getDailyCosts: function (dateStamp) {
    if (!checkUserId()) return Promise.reject(new Error("call setUserId() before use firestore"));
    return FireStoreRespository.queryMonthlyCosts(dateStamp, dateStamp, USER_ID);
  },
  getCost: function (id) {
    if (!checkUserId()) return Promise.reject(new Error("call setUserId() before use firestore"));
    return FireStoreRespository.queryCost(id, USER_ID);
  },
  insertCost: function (data) {
    if (!checkUserId()) return Promise.reject(new Error("call setUserId() before use firestore"));
    return FireStoreRespository.insertCost(data, USER_ID);
  },
  updateCost: function (data) {
    if (!checkUserId()) return Promise.reject(new Error("call setUserId() before use firestore"));
    return FireStoreRespository.updateCost(data, USER_ID);
  },
  deleteCost: function (id) {
    if (!checkUserId()) return Promise.reject(new Error("call setUserId() before use firestore"));
    return FireStoreRespository.deleteCost(id, USER_ID);
  },
  getCostTypes: function () {
    if (!checkUserId()) return Promise.reject(new Error("call setUserId() before use firestore"));
    return FireStoreRespository.getCostTypes(USER_ID);
  },
  updateCostTypes: function (types) {
    if (!checkUserId()) return Promise.reject(new Error("call setUserId() before use firestore"));
    return FireStoreRespository.setCostTypes(types, USER_ID);
  }
}

function checkUserId() {
  return USER_ID && USER_ID.length === 32;
}

function sumEachDayAmount(items) {
  return items.reduce((pv, cv) => {
    pv[cv.dateStamp] = pv[cv.dateStamp] ? pv[cv.dateStamp] + cv.amount : cv.amount;
    if (pv[cv.dateStamp]) {
      pv[cv.dateStamp].amount = cv.amount + pv[cv.dateStamp].amount;
    } else {
      pv[cv.dateStamp] = cv;
    }
    return pv;
  }, {});
}
