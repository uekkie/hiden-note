import { InjectionKey } from '@vue/composition-api'
import { NoteStore } from './use-note'

const NoteKey: InjectionKey<NoteStore> = Symbol('NoteStore')
export default NoteKey
