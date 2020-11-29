import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Auth from '~/store/auth'
import Notes from '~/store/notes'
import Users from '~/store/users'

// eslint-disable-next-line import/no-mutable-exports
let authStore: Auth
// eslint-disable-next-line import/no-mutable-exports
let notesStore: Notes
// eslint-disable-next-line import/no-mutable-exports
let usersStore: Users

function initialiseStores(store: Store<any>): void {
  authStore = getModule(Auth, store)
  notesStore = getModule(Notes, store)
  usersStore = getModule(Users, store)
}

export { initialiseStores, authStore, notesStore, usersStore }
