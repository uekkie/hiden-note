import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { firebase, db } from '@/plugins/firebase'

import { User, userConverter } from '@/models'
import { authStore } from '~/utils/store-accessor'

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

  get currentUser(): User {
    return this.user!
  }

  get userId(): string {
    return this.user ? this.user.uid : ''
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
    const user = new User({
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName!,
      photoURL: firebaseUser.photoURL!,
    })
    this.SET_USER(user)

    this.saveUser(user)
  }

  @Action
  public async saveUser(user: User) {
    const userDoc = userRef.doc(user.uid)
    await userDoc.withConverter(userConverter).set(user)
    console.log('saved user', user)
  }

  @Action
  public clear() {
    this.SET_USER(null)
  }

  @Action
  public login(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const provider = new firebase.auth.GoogleAuthProvider()

      firebase
        .auth()
        .signInWithPopup(provider)
        .then((value: firebase.auth.UserCredential) => {
          if (value.user) {
            this.doSignIn(value.user)
            resolve(true)
          } else {
            resolve(false)
          }
        })
    })
  }

  @Action
  logout() {
    firebase.auth().signOut()
    authStore.clear()
    return true
  }
}

export default Auth
