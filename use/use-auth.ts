import { toRefs, reactive } from '@nuxtjs/composition-api'
import firebase from 'firebase'
import 'firebase/firestore'

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

export default function () {
  const state = reactive<{
    user: firebase.User | null
    loading: boolean
    error: null
  }>({
    user: null,
    loading: true,
    error: null,
  })

  firebase.auth().onAuthStateChanged((_user) => {
    if (_user) {
      state.user = _user
    } else {
      state.user = null
    }
    state.loading = false
  })

  return {
    ...toRefs(state),
  }
}
