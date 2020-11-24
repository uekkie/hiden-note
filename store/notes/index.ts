import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { db, firebase } from '@/plugins/firebase'
import { Note, noteConverter } from '@/models/note'

const notesRef = db.collection('notes')
const recentNotesRef = db.collection('recentNotes')

const getNote = async (id: string) => {
  const noteQuery = await notesRef
    .doc(id)
    .collection('histories')
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get()

  const noteDoc = noteQuery.docs[0]

  const note = { ...noteDoc.data() }
  return note as Note
}

export const state = () => ({
  note: null as Note | null,
  notes: [] as Note[],
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  note: (state) => state.note,
  notes: (state) => state.notes,
}

export const mutations: MutationTree<RootState> = {
  SET_NOTE(state, note) {
    state.note = note
  },
  SET_NOTES(state, notes) {
    state.notes = notes
  },
}
export const actions: ActionTree<RootState, RootState> = {
  async createNote({ dispatch }, note): Promise<string> {
    const noteRef = await notesRef.add({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

    const historyRef = await notesRef
      .doc(noteRef.id)
      .collection('histories')
      .withConverter(noteConverter)
      .add(note)

    const historyDoc = await historyRef.get()
    dispatch('createRecentNote', { noteId: noteRef.id, historyDoc })
    return noteRef.id
  },
  async fetchNote({ commit }, noteId): Promise<any> {
    const note = await getNote(noteId)
    commit('SET_NOTE', note)
    return note
  },
  createRecentNote({ dispatch }, payload) {
    const noteId = payload.noteId
    const doc = payload.historyDoc

    recentNotesRef.doc(noteId).set({
      noteId,
      title: doc.get('title'),
      createdAt: doc.get('createdAt'),
    })
    dispatch('fetchNotes')
  },
  async updateNote({ dispatch }, payload) {
    const historyRef = await notesRef
      .doc(payload.noteId)
      .collection('histories')
      .withConverter(noteConverter)
      .add(payload.note)

    const historyDoc = await historyRef.get()
    dispatch('createRecentNote', {
      noteId: payload.noteId,
      historyDoc,
    })
  },
  async fetchNotes({ commit }, limit = 5) {
    const fetchNotes = [] as any
    const ref = await recentNotesRef
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get()

    ref.docs.forEach((data) => {
      fetchNotes.push({
        ...data.data(),
      })
    })
    commit('SET_NOTES', fetchNotes)
  },
  async deleteNote({ commit, dispatch }, noteId) {
    await notesRef.doc(noteId).delete()
    await recentNotesRef.doc(noteId).delete()
    dispatch('fetchNotes')
    commit('SET_NOTE', null)
  },
}
