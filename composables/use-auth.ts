import { toRefs, reactive, computed } from '@nuxtjs/composition-api'
import firebase from '@/plugins/firebase'
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

  const setUser = (user: firebase.User | undefined = undefined) => {
    if (user) {
      state.user = new User({
        id: user.uid,
        email: user.email!,
        displayName: user.displayName!,
        photoURL: user.photoURL!,
      })
    } else {
      state.user = undefined
    }
    state.loading = false
  }

  return {
    ...toRefs(state),
    isValid,
    login,
    logout,
    setUser,
  }
}
export type AuthStore = ReturnType<typeof useAuth>
