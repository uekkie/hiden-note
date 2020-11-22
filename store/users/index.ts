import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { firebase, db } from '@/plugins/firebase'
import { vuexfireMutations } from 'vuexfire'

import { User } from '@/models'

const userRef = db.collection('users')

export const state = () => ({
  user: null as null | User,
  loggedIn: false as boolean,
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  userSignedIn: (state) => state.loggedIn,
  userDisplayName: (state) => state.user?.displayName,
  currentUser: (state) => state.user,
  currentUserRef: (state) => userRef.doc(state.user?.uid),
}

export const mutations: MutationTree<RootState> = {
  ...vuexfireMutations,
  setCurrentUser(state, user: User) {
    state.user = user
    const currentUserRef = userRef.doc(user.uid)

    currentUserRef
      .get()
      .then(function (doc) {
        // Userがdbに保存されてなかったら保存
        if (!doc.exists) {
          userRef.add(user)
        }
      })
      .catch(function (error) {
        console.log('Error getting document:', error)
      })
    state.loggedIn = true
  },
  clearCurrentUser(state) {
    state.loggedIn = false
  },
  SET_USER(state, user: User) {
    state.loggedIn = user !== null
    state.user = user
  },
}

export const actions: ActionTree<RootState, RootState> = {
  authStateChanged({ commit }) {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        commit('SET_USER', null)
        return
      }
      const { uid, email, displayName } = user
      commit('SET_USER', new User(uid, email!, displayName!))
    })
  },
  login() {
    const provider = new firebase.auth.GoogleAuthProvider()

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function () {
        console.log('logged in!')
      })
      .catch(function (error) {
        const errorCode = error.errorCode
        console.log('error :' + errorCode)
      })
  },
  logout() {
    firebase
      .auth()
      .signOut()
      .then(
        (_) => {
          // ログイン画面に戻る
        },
        (err) => {
          // エラー表示
          console.log(err)
        }
      )
  },
  setCurrentUser({ commit }, user: User) {
    commit('SET_USER', user)

    const currentUserRef = userRef.doc(user.uid)

    currentUserRef
      .get()
      .then(function (doc) {
        // Userがdbに保存されてなかったら保存
        if (!doc.exists) {
          userRef.add(user)
        }
      })
      .catch(function (error) {
        console.log('Error getting document:', error)
      })
  },
}
