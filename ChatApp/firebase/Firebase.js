import { initializeApp } from 'firebase/app'
import firebase from 'firebase/app';

import { 
    getAuth, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,   
    signInWithEmailAndPassword,
    sendEmailVerification,  
    //read data from Firebase    
} from "firebase/auth"
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { 
    getDatabase, 
    ref as firebaseDatabaseRef, 
    set as firebaseSet,
    child,
    get,
    onValue,
} from "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyBFiINJCJWRtILlcU5E4lup2Fqgzj6cAF4",
    authDomain: "nightchatapp-cb67d.firebaseapp.com",
    databaseURL: "https://chatapp-78202-default-rtdb.firebaseio.com",
    projectId: "nightchatapp-cb67d",
    storageBucket: "nightchatapp-cb67d.appspot.com",
    appId: '1:120235313962:android:083743ccb54aa4a002ac53',
    messagingSenderId: "120235313962",
} 
const app = initializeApp(firebaseConfig)
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
const firebaseDatabase = getDatabase()
export {
    auth,
    firebaseDatabase,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    firebaseSet,
    firebaseDatabaseRef,
    sendEmailVerification,
    child,
    get,
    onValue, //reload when online DB changed
    signInWithEmailAndPassword,
    firebase
}