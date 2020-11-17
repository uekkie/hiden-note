import { GetterTree, ActionTree, MutationTree } from 'vuex'
import firebase from '~/plugins/firebase'

export const state = () => ({
  user: null as firebase.User | null,
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  currentUser: () => firebase.auth().currentUser,
}

export const mutations: MutationTree<RootState> = {
  LOGIN_GOOLE(state) {
    const provider = new firebase.auth.GoogleAuthProvider()

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        state.user = result.user
        console.log('logged in!')
      })
      .catch(function (error) {
        const errorCode = error.errorCode
        console.log('error :' + errorCode)
      })
  },
  LOGOUT_GOOLE(state) {
    firebase
      .auth()
      .signOut()
      .then(
        (_) => {
          // ログイン画面に戻る
          state.user = null
        },
        (err) => {
          // エラー表示
          console.log(err)
        }
      )
  },
}

export const actions: ActionTree<RootState, RootState> = {
  login({ commit }) {
    commit('LOGIN_GOOLE')
  },
  logout({ commit }) {
    commit('LOGOUT_GOOLE')
  },
}
