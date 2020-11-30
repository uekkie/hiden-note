import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Auth from '~/store/auth'
import Notes from '~/store/notes'
import Users from '~/store/users'
import Comments from '~/store/comments'

// eslint-disable-next-line import/no-mutable-exports
let authStore: Auth
// eslint-disable-next-line import/no-mutable-exports
let notesStore: Notes
// eslint-disable-next-line import/no-mutable-exports
let usersStore: Users
// eslint-disable-next-line import/no-mutable-exports
let commentsStore: Comments

function initialiseStores(store: Store<any>): void {
  authStore = getModule(Auth, store)
  notesStore = getModule(Notes, store)
  usersStore = getModule(Users, store)
  commentsStore = getModule(Comments, store)
}

export { initialiseStores, authStore, notesStore, usersStore, commentsStore }
