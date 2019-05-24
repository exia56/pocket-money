const FirestoreCostsRespository = require('../respository/firestore-costs-respository');
const RealmCostsRespository = require('../respository/realm-costs-respository');
const moment = require('moment');
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
module.exports = {
  getDateArrayAsync: function (date) {
    let lastMonth = date.clone().date(1).add(-1, "day"),
      startOffset = lastMonth.weekday(),
      thisLastDay = date.clone().endOf("month"),
      today = moment(),
      //加上上個月的星期天數，然後加上個這個月的所有天數，再加上剩餘補齊一星期的天數
      totalday = lastMonth.weekday() + thisLastDay.date() + (7 - thisLastDay.weekday());
    let daysArray = [];
    //若最後只有5個星期，則加入上個月的多一個星期
    if (totalday === 35) {
      startOffset += 7;
    }
    lastMonth = lastMonth.add(-startOffset, "day");
    for (let idx = 0; idx < 42; idx++) {
      daysArray[idx] = this.createCellData(lastMonth.year(), lastMonth.month() + 1, lastMonth.date());
      lastMonth = lastMonth.add(1, "day");
    }
    return RealmCostsRespository.getDateArrayAsync(daysArray[0].dateStamp, daysArray[41].dateStamp)
      .then(datas => {
        let d = sumEachDayAmount(datas),
          monthly = 0,
          monthStart = daysArray[21].dateStamp - 20,
          monthEnd = daysArray[21].dateStamp + 20;
        daysArray.forEach(v => {
          v.amount = d[v.dateStamp] || 0;
          if (v.dateStamp >= monthStart && v.dateStamp <= monthEnd)
            monthly += v.amount;
        });
        return { daysArray, monthly };
      });

  },
  getThisDayCostsAsync: function (dateStamp) {
    return RealmCostsRespository.getThisDayCostsAsync(dateStamp);
  },

  createCellData: function (y, m, d) {
    let dateStamp = y + `${m}`.padStart(2, "0") + `${d}`.padStart(2, "0"),
      mnt = moment(dateStamp, "YYYYMMDD");
    return {
      mnt,
      year: y,
      month: m,
      day: d,
      dateStamp: +dateStamp,
      amount: 0
    }
  },

  insert: function (data) {
    FirestoreCostsRespository.insert(data);
    return RealmCostsRespository.insert(data);
  },
  insertMany: function (data) {
    FirestoreCostsRespository.insertMany(data);
    return RealmCostsRespository.insertMany(data);
  },
  update: function (data) {
    FirestoreCostsRespository.update(data);
    return RealmCostsRespository.update(data);
  },
  delete: function (data) {
    FirestoreCostsRespository.delete(data);
    return RealmCostsRespository.delete(data);
  },
  syncCloud: function () {
    return FirestoreCostsRespository.pull()
      .then(datas => {
        return RealmCostsRespository.insertMany(datas);
      });
  }
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