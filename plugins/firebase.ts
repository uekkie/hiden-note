import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'

if (firebase.apps.length === 0) {
  const firebaseConfig = {
    apiKey: 'AIzaSyDtK7TZaHoB03Ei06sxuc1VpuVM5AxAiNM',
    authDomain: 'hiden-note.firebaseapp.com',
    databaseURL: 'https://hiden-note.firebaseio.com',
    projectId: 'hiden-note',
    storageBucket: 'hiden-note.appspot.com',
  }
  firebase.initializeApp(firebaseConfig)
}
export default firebase
export const auth = firebase.auth()
// export const functions = firebase.app().functions('asia-northeast1')
export const db = firebase.firestore()
export const timestamp = () => firebase.firestore.FieldValue.serverTimestamp()
