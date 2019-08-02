const firebase = require("react-native-firebase");
const utils = require("../helper/utils");
const DOCS_ID = {
  CONFIG: "Config"
}, COLL_ID = {
  COST_TYPES: "CostTypes",
  PASSWORD: "PASSWORD",
}
let USER_ID = "";
module.exports = {
  DOCS_ID,
  COLL_ID,
  queryMonthlyCosts: function (from, to, USER_ID) {
    let mikeObj = firebase.firestore().collection(USER_ID);
    return mikeObj.where("dateStamp", ">=", from).where("dateStamp", "<=", to)
      .get().then(doc => {
        if (doc.empty)
          return [];
        else {
          // console.log(doc.docs);
          return doc.docs.map(v => {
            let d = v.data();
            d.id = v.id;
            return d;
          });
        }
      });
  },
  queryCost: function (objId, USER_ID) {
    let mikeDoc = firebase.firestore().collection(USER_ID).doc(objId);
    return mikeDoc.get().then(doc => {
      if (doc.exists) {
        let data = doc.data();
        data.id = doc.id;
        return data;
      } else
        return Promise.reject(new Error(`user ${USER_ID} data id ${objId} not found!`));
    });
  },
  insertCost: function (data, USER_ID) {
    let mikeObj = firebase.firestore().collection(USER_ID);
    return mikeObj.add(data);
  },
  updateCost: function (data, USER_ID) {
    const id = data.id;
    let mikeObj = firebase.firestore().collection(USER_ID).doc(id);
    delete data.id;
    return mikeObj.set(data);
  },
  deleteCost: function (id, USER_ID) {
    let mikeObj = firebase.firestore().collection(USER_ID).doc(id);
    return mikeObj.delete();
  },
  setCostTypes: function (types, USER_ID) {
    let fsDoc = firebase.firestore().collection(USER_ID).doc(DOCS_ID.CONFIG).collection(COLL_ID.COST_TYPES);
    return fsDoc.set(types);
  },
  getCostTypes: function (USER_ID) {
    let fsColl = firebase.firestore().collection(USER_ID).doc(DOCS_ID.CONFIG).collection(COLL_ID.COST_TYPES);
    return fsColl.get()
      .then(doc => {
        if (doc.exists)
          return doc.data();
        else Promise.reject(new Error(`user ${USER_ID} cost type not found!`));
      });
  },

  querys: function (collectionPath, filter: (collection) => {}) {
    let collection = firebase.firestore().collection(collectionPath);
    collection = filter(collection);
    return collection.get()
      .then(docs => {
        if (docs.empty)
          return [];
        else {
          // console.log(docs.docs);
          return docs.docs.map(v => {
            let d = v.data();
            d.id = v.id;
            d.path = v.ref.path;
            return d;
          });
        }
      })
  },
  query: function (documentPath) {
    return firebase.firestore().doc(documentPath).get()
      .then(doc => {
        if (doc.exists) {
          let data = doc.data();
          data.id = doc.id;
          data.path = doc.ref.path;
          return data;
        } else
          return Promise.reject(new Error(`data path ${documentPath} not found!`));
      })

  },
  insert: function (collectionPath, data) {
    let collection = firebase.firestore().collection(collectionPath);
    if (data.id) {
      const { id, ...d } = data;
      return collection.doc(id).set(d);
    } else
      return collection.add(data);
  },
  insertMany: function (collectionPath, datas) {
    let batch = firebase.firestore().batch();
    let collection = firebase.firestore().collection(collectionPath);
    datas.forEach((data) => {
      const id = data.id;
      delete data.id;
      collection.doc(id).get();;
      const f = collection.doc(id);
      batch.update(f, data);
    })
    return batch.commit();
  },
  update: function (documentPath, data) {
    let doc = firebase.firestore().doc(documentPath);
    return doc.set(data).then(() => data);
  },
  delete: function (documentPath) {
    let doc = firebase.firestore().doc(documentPath);
    return doc.delete();
  }
}
