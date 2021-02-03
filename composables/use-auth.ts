import { toRefs, reactive, computed } from '@nuxtjs/composition-api'
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

export default function useAuth() {
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

  const isValid = computed(() => {
    const { user } = state
    return user !== null
  })

  const login = () => {
    const provider = new firebase.auth.GoogleAuthProvider()

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(
        () => {},
        (error) => (state.error = error)
      )
      .catch((error) => {
        state.error = error
      })
  }

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(
        () => {},
        (error) => (state.error = error)
      )
      .catch((error) => {
        state.error = error
      })
  }

  return {
    ...toRefs(state),
    isValid,
    login,
    logout,
  }
}
export type AuthStore = ReturnType<typeof useAuth>
