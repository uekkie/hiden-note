import firebase from 'firebase'
import 'firebase/auth'

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
}
if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export const db = firebase.firestore()
export const auth = firebase.auth()
export const FieldValue = firebase.firestore.FieldValue

export { firebase }
