import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Users from '@/store/users'

// eslint-disable-next-line import/no-mutable-exports
let usersStore: Users

function initialiseStores(store: Store<any>): void {
  usersStore = getModule(Users, store)
}

export { initialiseStores, usersStore }
