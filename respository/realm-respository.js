const Realm = require('realm');
const utils = require('../helper/utils');

const COLL_COST = 'Cost';
const COLL_COST_TYPE = 'CostType';

const CostTypeSchema = {
  name: COLL_COST_TYPE,
  primaryKey: 'id',
  properties: {
    id: 'int',
    caption: 'string',
  }
}

const CostSchema = {
  name: COLL_COST,
  primaryKey: 'id',
  properties: {
    id: 'string',
    amount: 'int',
    dateStamp: 'int',
    day: 'int',
    detail: 'string',
    month: 'int',
    year: 'int',
    type: 'int',
  }
};

const realm = new Realm({
  schema: [CostSchema, CostTypeSchema],
  schemaVersion: 1,
  migration: (oldRealm, newRealm) => {

  }
});

module.exports = {
  COLL_COST,
  COLL_COST_TYPE,
  querys: function (collection, filter: (collection) => {}) {
    return new Promise((resolve, reject) => {
      try {
        let costs = realm.objects(collection);
        console.log('all', costs.length);
        if (filter)
          costs = filter(costs);
        costs = [...costs.values()];
        console.log("result", costs);
        resolve(costs);
      } catch (e) {
        reject(e);
      }
    });
  },
  query: function (collection, id) {
    return new Promise((resolve, reject) => {
      try {
        let costs = filter(realm.objectForPrimaryKey(collection, id));
        console.log(costs);
        resolve(JSON.parse(JSON.stringify(costs)));
      } catch (e) {
        reject(e);
      }
    });
  },
  insert: function (collection, data) {
    console.log('123123123', data);
    if (!data.id)
      data.id = utils.randomString();
    return new Promise((resolve, reject) => {
      try {
        let cost;
        realm.write(() => {
          cost = realm.create(collection, data);
        });
        console.log(cost);
        resolve(cost);
      } catch (e) {
        reject(e);
      }
    });
  },
  insertMany: function (collection, datas) {
    return new Promise((resolve, reject) => {
      try {
        console.log(realm.objects(collection).length);
        realm.write(() => {
          datas.forEach((data) => {
            if (!data.id)
              data.id = utils.randomString();
            if (!data.timeStamp)
              data.timeStamp = Date.now();

            realm.create(collection, data, true);
          })
        });
        console.log(realm.objects(collection).length);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  update: function (collection, data) {
    return new Promise((resolve, reject) => {
      try {
        let cost;
        realm.write(() => {
          cost = realm.create(collection, data, true);
        });
        console.log(cost);
        resolve(cost);
      } catch (e) {
        reject(e);
      }
    });
  },
  delete: function (collection, id) {
    return new Promise((resolve, reject) => {
      try {
        const cost = realm.objectForPrimaryKey(collection, id);
        realm.write(() => {
          realm.delete(cost);
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  },
  empty: function () {
    return new Promise((resolve, reject) => {
      try {
        const cost = realm.objects(COLL_COST);
        const costType = realm.objects(COLL_COST_TYPE);
        realm.write(() => {
          realm.delete(cost);
          realm.delete(costType);
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}