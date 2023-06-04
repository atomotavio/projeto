'use strict'

const firebaseConfig = {
  apiKey: "AIzaSyAUVrxOfGHy6Y-myED8roLv8TTcSwnaX7I",
  authDomain: "lista-de-tarefas-938d8.firebaseapp.com",
  projectId: "lista-de-tarefas-938d8",
  storageBucket: "lista-de-tarefas-938d8.appspot.com",
  messagingSenderId: "273181921323",
  appId: "1:273181921323:web:45ed3c3a99d55c137eda6e"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const storageRef = firebase.storage().ref();
