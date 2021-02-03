import { InjectionKey } from '@vue/composition-api'
import { AuthStore } from './use-auth'

const AuthKey: InjectionKey<AuthStore> = Symbol('AuthStore')
export default AuthKey
