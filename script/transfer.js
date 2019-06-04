const firebase = require('firebase');

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({});

var firestore = firebase.firestore();
const from = '';
const to = '';

firestore.collection(from).get()
  .then(res => {
    const map = [];
    res.forEach(d => {
      map.push(firestore.collection(to).doc(d.id).set(d.data()));
    });
    return Promise.all(map);
  })
  .then((res) => {
    console.log(res);
    process.exit();
  }).catch((err) => {
    console.log(err);
    process.exit(1);
  })