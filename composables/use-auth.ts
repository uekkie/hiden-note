import { toRefs, reactive, computed } from '@nuxtjs/composition-api'
import firebase, { auth } from '@/plugins/firebase'
import { User } from '@/models/user'

export default function useAuth() {
  const state = reactive<{
    user?: User
    loading: boolean
    error: null
  }>({
    user: undefined,
    loading: true,
    error: null,
  })

  auth.onAuthStateChanged((_user) => {
    if (state.user) {
      state.user = undefined
    }
    if (_user) {
      state.user = new User({
        id: _user.uid,
        email: _user.email!,
        displayName: _user.displayName!,
        photoURL: _user.photoURL!,
      })
    } else {
      state.user = undefined
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
