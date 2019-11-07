import firebase from 'firebase';

 const firebaseConfig = {
    apiKey: "AIzaSyDm9lqCKRygM-xrKPI0WY_2eqQICsKTjgM",
    authDomain: "list-3-again.firebaseapp.com",
    databaseURL: "https://list-3-again.firebaseio.com",
    projectId: "list-3-again",
    storageBucket: "list-3-again.appspot.com",
    messagingSenderId: "905172563800",
    appId: "1:905172563800:web:a5d90ae460a7130792972d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export const provider = new firebase.auth.GoogleAuthProvider();
  export const auth = firebase.auth();

  export default firebase;