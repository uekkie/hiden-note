import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { firebase, db } from '@/plugins/firebase'
import { vuexfireMutations } from 'vuexfire'

import { Note, User } from '@/models'

export const state = () => ({
  user: null as null | User,
  loggedIn: false as boolean,
  notes: [] as Note[],
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  userSignedIn: (state) => state.loggedIn,
  userDisplayName: (state) => state.user?.displayName,
  notes: (state) => state.notes,
  currentUser: (state) => state.user,
  userRef: (state) => db.collection('users').doc(state.user?.uid),
}

export const mutations: MutationTree<RootState> = {
  ...vuexfireMutations,

  fetchNotes(state) {
    db.collection('notes')
      .get()
      .then(function (snapshot) {
        const fetchNotes: Note[] = []
        snapshot.forEach((note) => {
          fetchNotes.push(
            new Note(
              note.id,
              note.get('userRef'),
              note.get('title'),
              note.get('content'),
              note.get('createdAt')?.toDate(),
              note.get('updatedAt')?.toDate()
            )
          )
        })
        state.notes = fetchNotes
      })
  },
  setCurrentUser(state, user: User) {
    state.user = user
    const userRef = db.collection('users').doc(user.uid)

    userRef
      .get()
      .then(function (doc) {
        // Userがdbに保存されてなかったら保存
        if (!doc.exists) {
          db.collection('users').add(user)
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
}
