const firebaseConfig = {
  apiKey: "AIzaSyAUVrxOfGHy6Y-myED8roLv8TTcSwnaX7I",
  authDomain: "lista-de-tarefas-938d8.firebaseapp.com",
  projectId: "lista-de-tarefas-938d8",
  storageBucket: "lista-de-tarefas-938d8.appspot.com",
  messagingSenderId: "273181921323",
  appId: "1:273181921323:web:45ed3c3a99d55c137eda6e"
};

  //inicializando o Firebase
  firebase.initializeApp(firebaseConfig)
  //efetuando a ligação com o database
  const database = firebase.database()