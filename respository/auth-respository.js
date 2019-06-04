const auth = require('react-native-firebase').auth()

module.exports = {
  createUser: function (email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  },
  signIn: function (email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  },
  signOut: function () {
    return auth.signOut();
  },
  resetPassword: function (email) {
    return auth.sendPasswordResetEmail(email);
  }
};
