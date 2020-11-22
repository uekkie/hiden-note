import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { db } from '@/plugins/firebase'
import { Note, noteConverter } from '@/models/note'

const notesRef = db.collection('notes')

export const state = () => ({
  notes: [] as Note[],
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  notes: (state) => state.notes,
}

export const mutations: MutationTree<RootState> = {
  SET_NOTES(state, notes) {
    state.notes = notes
  },
}
export const actions: ActionTree<RootState, RootState> = {
  createNote(_, payload) {
    const note = new Note('', payload.userRef, payload.title, payload.content)
    notesRef.withConverter(noteConverter).add(note)
  },
  fetchNotes({ commit }) {
    notesRef.get().then(function (snapshot) {
      const fetchNotes: Note[] = []
      snapshot.forEach((note) => {
        fetchNotes.push(
          new Note(
            note.id,
            note.get('userRef'),
            note.get('title'),
            note.get('content'),
            note.get('createdAt')?.toDate(),
            note.get('updatedAt')?.toDate()
          )
        )
      })
      commit('SET_NOTES', fetchNotes)
    })
  },
}
