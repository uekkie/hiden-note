import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { firebase, db } from '@/plugins/firebase'

import { User } from '@/models'

const userRef = db.collection('users')

@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true,
})
class Auth extends VuexModule {
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

  @Action({ rawError: true })
  public doSignIn(firebaseUser: firebase.User) {
    this.SET_USER({
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName!,
    } as User)
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

export default Auth
