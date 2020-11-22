import firebase from 'firebase'
import 'firebase/auth'

const config = {
  apiKey: 'AIzaSyDtK7TZaHoB03Ei06sxuc1VpuVM5AxAiNM',
  authDomain: 'hiden-note.firebaseapp.com',
  databaseURL: 'https://hiden-note.firebaseio.com',
  projectId: 'hiden-note',
  storageBucket: 'hiden-note.appspot.com',
  messagingSenderId: '546700661025',
  appId: '1:546700661025:web:ce5e2065eca876206fae60',
  measurementId: 'G-TJHJSRS8EH',
}
if (!firebase.apps.length) {
  firebase.initializeApp(config)
}
const db = firebase.firestore()

export { firebase, db }
