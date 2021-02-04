import { toRefs, reactive, computed } from '@nuxtjs/composition-api'
import firebase, { auth } from '@/plugins/firebase'

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

  auth.onAuthStateChanged((_user) => {
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
