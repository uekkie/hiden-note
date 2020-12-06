import firebase from 'firebase'
import 'firebase/auth'

const config = {
  apiKey: 'AIzaSyDtK7TZaHoB03Ei06sxuc1VpuVM5AxAiNM',
  authDomain: 'hiden-note.firebaseapp.com',
  databaseURL: 'https://hiden-note.firebaseio.com',
  projectId: 'hiden-note',
  storageBucket: 'hiden-note.appspot.com',
}
if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export const db = firebase.firestore()
export const auth = firebase.auth()
export const FieldValue = firebase.firestore.FieldValue

export { firebase }
