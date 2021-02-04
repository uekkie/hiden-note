import { InjectionKey } from '@vue/composition-api'
import { TagStore } from './use-tag'

const TagKey: InjectionKey<TagStore> = Symbol('TagStore')
export default TagKey
