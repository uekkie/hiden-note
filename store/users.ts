import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { firebase, db } from '@/plugins/firebase'

import { User } from '@/models'

const userRef = db.collection('users')

@Module({
  name: 'users',
  stateFactory: true,
  namespaced: true,
})
class Users extends VuexModule {
  user: null | User = null
  loggedIn: boolean = false

  get userSignedIn() {
    return this.loggedIn
  }

  get userDisplayName() {
    return this.user?.displayName
  }

  get currentUser() {
    return this.user
  }

  get currentUserRef() {
    return userRef.doc(this.user?.uid)
  }

  @Mutation
  SET_USER(user: User | null) {
    this.loggedIn = user !== null
    this.user = user
  }

  @Action({})
  authStateChanged() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.SET_USER(null)
        return
      }
      const { uid, email, displayName } = user
      const userData = new User(uid, email!, displayName!)
      console.log(userData)
      this.SET_USER(userData)

      const currentUserRef = this.userRef.doc(user.uid)

      currentUserRef.get().then(function (doc) {
        // Userがdbに保存されてなかったら保存
        if (!doc.exists) {
          currentUserRef.set({
            email: userData.email,
            displayName: userData.displayName,
          })
        }
      })
    })
  }

  @Action
  login() {
    const provider = new firebase.auth.GoogleAuthProvider()

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function () {})
  }

  @Action
  logout() {
    firebase
      .auth()
      .signOut()
      .then((_) => {
        // ログイン画面に戻る
      })
  }
}

export default Users
