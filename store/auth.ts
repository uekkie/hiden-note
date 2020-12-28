import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { User, userConverter } from '@/models'
import firebase from 'firebase'
import { authStore, notesStore, usersStore } from '~/utils/store-accessor'

const userRef = firebase.firestore().collection('users')

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
    return this.user ? this.user.id : ''
  }

  @Mutation
  CLEAR_AUTH() {
    this.loggedIn = false
    this.user = null
  }

  @Mutation
  SET_USER(user: User | null) {
    this.loggedIn = user !== null
    this.user = user
  }

  @Action({ rawError: true })
  public doSignIn(firebaseUser: firebase.User) {
    const user = new User({
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName!,
      photoURL: firebaseUser.photoURL!,
    })
    this.SET_USER(user)

    this.saveUser(user)
  }

  @Action({ rawError: true })
  public async saveUser(user: User) {
    const userDoc = userRef.doc(user.id)
    await userDoc.withConverter(userConverter).set(user)
  }

  @Action({ rawError: true })
  public clear() {
    this.CLEAR_AUTH()
  }

  @Action({ rawError: true })
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

  @Action({ rawError: true })
  async logout() {
    await firebase.auth().signOut()
    authStore.clear()
    notesStore.clear()
    usersStore.clear()

    return true
  }
}

export default Auth
