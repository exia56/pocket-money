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
        if (filter)
          costs = filter(costs);
        costs = Object.values(costs);
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
        resolve(JSON.parse(JSON.stringify(costs)));
      } catch (e) {
        reject(e);
      }
    });
  },
  insert: function (collection, data) {
    if (!data.id)
      data.id = utils.randomString();
    return new Promise((resolve, reject) => {
      try {
        let cost;
        realm.write(() => {
          cost = realm.create(collection, data);
        });
        resolve(cost);
      } catch (e) {
        reject(e);
      }
    });
  },
  insertMany: function (collection, datas) {
    return new Promise((resolve, reject) => {
      try {
        realm.write(() => {
          datas.forEach((data) => {
            if (!data.id)
              data.id = utils.randomString();
            if (!data.timeStamp)
              data.timeStamp = Date.now();

            realm.create(collection, data, true);
          })
        });

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