import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCFTlIDYOXJ3YjOR2EdGKQO7r7OI3aj5Tc",
  authDomain: "x10game-workshop.firebaseapp.com",
  databaseURL: "https://x10game-workshop-default-rtdb.firebaseio.com",
  projectId: "x10game-workshop",
  storageBucket: "x10game-workshop.appspot.com",
  messagingSenderId: "818282410057",
  appId: "1:818282410057:web:420aab4c42ed61108b8f98"
};

firebase.initializeApp(firebaseConfig);
export default firebase.database();
