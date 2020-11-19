import { GetterTree, ActionTree, MutationTree } from 'vuex'
import firebase from '@/plugins/firebase'
import { vuexfireMutations, firestoreAction } from 'vuexfire'

const db = firebase.firestore()
const notesRef = db.collection('hiden').doc('notes')

// MEMO 使い方わからん
// export interface UserData {
//   uid: string
//   email: string
//   displayName: string
// }

export const state = () => ({
  uid: '',
  email: '',
  displayName: '',
  notes: [],
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  userSignedIn: (state) => !!state.uid,
  userUid: (state) => state.uid,
  userEmail: (state) => state.email,
  userDisplayName: (state) => state.displayName,
  notes: (state) => state.notes,
}

export const mutations: MutationTree<RootState> = {
  ...vuexfireMutations,

  setCurrentUser(state, user) {
    state.uid = user.uid
    state.email = user.email
    state.displayName = user.displayName
  },
  clearCurrentUser(state) {
    state.uid = ''
    state.email = ''
    state.displayName = ''
  },
  LOGIN_GOOLE() {
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
  LOGOUT_GOOLE() {
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
}

export const actions: ActionTree<RootState, RootState> = {
  login({ commit }) {
    commit('LOGIN_GOOLE')
  },
  logout({ commit }) {
    commit('LOGOUT_GOOLE')
  },
  saveNote: firestoreAction((note) => {
    notesRef
      .set(note)
      .then(() => {
        // success
      })
      .catch(() => {
        // error
      })
  }),
  setNotesRef: firestoreAction(function (context, ref) {
    context.bindFirestoreRef('notes', ref)
  }),
}
