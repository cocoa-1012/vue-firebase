/**
 * Firebase Login
 * Vuely comes with built in firebase login feature
 * You Need To Add Your Firsebase App Account Details Here
 */
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';

// Initialize Firebase 
const config = {
    apiKey: "AIzaSyDqptFQTr0Zv8Nqb7np0crvw-AF4MCPXgc",
    authDomain: "g-rams.firebaseapp.com",
    databaseURL: "https://g-rams.firebaseio.com",
    projectId: "g-rams",
    storageBucket: "g-rams.appspot.com",
    messagingSenderId: "1039726819197",
    appId: "1:1039726819197:web:88a2d1a99c471d370bbe14"
};


firebase.initializeApp(config);


const auth = firebase.auth();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
const githubAuthProvider = new firebase.auth.GithubAuthProvider();
const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();
const database = firebase.database();


const storage = firebase.storage()
const storageRef = storage.ref();

const db = firebase.firestore();
const dbProcCollectionsRef = db.collection('PROC_Collections')
const dbProcProceduresRef = db.collection('PROC_Procedures')
const dbProcCategoriesRef = db.collection('PROC_Categories')
const dbProcUsersRef = db.collection('PROC_Users')
const dbMediaRef = db.collection('media')


export {
    auth,
    googleAuthProvider,
    githubAuthProvider,
    facebookAuthProvider,
    twitterAuthProvider,
    database,

    /* proceed */
    db,
    dbProcCollectionsRef,
    dbProcProceduresRef,
    dbProcCategoriesRef,
    dbProcUsersRef,
    firebase,
    storage,
    dbMediaRef,
    storageRef
};
