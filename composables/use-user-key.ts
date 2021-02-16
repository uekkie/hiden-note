import { InjectionKey } from '@vue/composition-api'
import { UserStore } from './use-user'

const UserKey: InjectionKey<UserStore> = Symbol('UserStore')
export default UserKey
