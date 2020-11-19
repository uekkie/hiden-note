import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { firebase, db } from '@/plugins/firebase'
import { vuexfireMutations } from 'vuexfire'

export type Note = {
  id: string
  title: string
  content: string
}

export const state = () => ({
  uid: '',
  email: '',
  displayName: '',
  notes: [] as Note[],
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  userSignedIn: (state) => !!state.uid,
  userUid: (state) => state.uid,
  userEmail: (state) => state.email,
  userDisplayName: (state) => state.displayName,
  notes: (state) => state.notes,
  currentUser(_, getters) {
    return {
      uid: getters.userUid,
      email: getters.userEmail,
      displayName: getters.userDisplayName,
    }
  },
}

export const mutations: MutationTree<RootState> = {
  ...vuexfireMutations,

  fetchNotes(state) {
    db.collection('notes')
      .get()
      .then(function (snapshot) {
        const fetchNotes: Note[] = []
        snapshot.forEach((note) => {
          fetchNotes.push({
            id: note.id,
            title: note.get('title'),
            content: note.get('content'),
          })
        })
        state.notes = fetchNotes
      })
  },
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
}
