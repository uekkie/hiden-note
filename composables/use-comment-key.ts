import { InjectionKey } from '@vue/composition-api'
import { CommentStore } from './use-comment'

const CommentKey: InjectionKey<CommentStore> = Symbol('CommentStore')
export default CommentKey
