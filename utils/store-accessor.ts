import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Auth from '~/store/auth'
import Notes from '~/store/notes'

// eslint-disable-next-line import/no-mutable-exports
let authStore: Auth
// eslint-disable-next-line import/no-mutable-exports
let notesStore: Notes

function initialiseStores(store: Store<any>): void {
  authStore = getModule(Auth, store)
  notesStore = getModule(Notes, store)
}

export { initialiseStores, authStore, notesStore }
