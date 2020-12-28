import { toRefs, reactive, computed } from '@nuxtjs/composition-api'
import firebase from 'firebase'
import 'firebase/firestore'

export default function () {
  const state = reactive<{
    error: null
    user: firebase.User | null
  }>({
    error: null,
    user: null,
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
