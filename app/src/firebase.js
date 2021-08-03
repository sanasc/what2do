import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB0h22wiHLitL3J_-0XqYdZ3HAkuKAofl4",
    authDomain: "what2do-fabc5.firebaseapp.com",
    databaseURL: "https://what2do-fabc5-default-rtdb.firebaseio.com",
    projectId: "what2do-fabc5",
    storageBucket: "what2do-fabc5.appspot.com",
    messagingSenderId: "917958482489",
    appId: "1:917958482489:web:3b000c19e8fd12cde38be8",
    measurementId: "G-FNTXD7HQC0"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
