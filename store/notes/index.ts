import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { db, firebase } from '@/plugins/firebase'
import { Note, noteConverter } from '@/models/note'

const notesRef = db.collection('notes')
const tagsRef  = db.collection('tags')
const recentNotesRef = db.collection('recentNotes')

export interface RecentNote {
  title: string
  noteId: string
  createdAt: Date
  userName: string
}
// const getNote = async (id: string): Promise<Note> => {
//   const noteQuery = await notesRef
//     .doc(id)
//     .collection('histories')
//     .orderBy('createdAt', 'desc')
//     .limit(1)
//     .get()

//   const noteDoc = noteQuery.docs[0]

//   const note = { ...noteDoc.data() }
//   return note as Note
// }
const getNote = async (id: string): Promise<Note> => {
  const noteRef = await notesRef.doc(id).get()
  const note = { ...noteRef.data() }
  return note as Note
}

export const state = () => ({
  note: null as Note | null,
  notes: [] as RecentNote[],
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
  CLEAR_NOTES(state) {
    state.notes = []
  },
  APPEND_TO_NOTES(state, data) {
    state.notes.push(data)
  },
}
export const actions: ActionTree<RootState, RootState> = {
  async createNote({ dispatch }, note): Promise<string> {
    const noteRef = await notesRef.add({
      title: note.title,
      content: note.content,
      tags: firebase.firestore.FieldValue.arrayUnion(note.tags),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

    const historyRef = await notesRef
      .doc(noteRef.id)
      .collection('histories')
      .withConverter(noteConverter)
      .add(note)

    const historyDoc = await historyRef.get()
    dispatch('createRecentNote', { noteId: noteRef.id, historyDoc, userName: 'hoge' })

    return noteRef.id
  },
  async fetchNote({ commit }, noteId): Promise<Note> {
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
      userName: 'hoge',
    })
    dispatch('fetchNotes')
  },
  async updateNote({ dispatch }, payload) {
    const historyRef = await notesRef
      .doc(payload.noteId)
      .collection('histories')
      .withConverter(noteConverter)
      .add(payload.noteHistory)

    const historyDoc = await historyRef.get()
    dispatch('createRecentNote', {
      noteId: payload.noteId,
      userName: payload.userName,
      historyDoc,
    })
  },
  async fetchNotes({ commit }, limit = 5) {
    commit('CLEAR_NOTES')

    const ref = await recentNotesRef
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get()

    ref.docs.forEach((data) => {
      commit('APPEND_TO_NOTES', { ...data.data() } as RecentNote)
    })
  },
  async deleteNote({ commit, dispatch }, noteId) {
    await notesRef.doc(noteId).delete()
    await recentNotesRef.doc(noteId).delete()
    dispatch('fetchNotes')
    commit('SET_NOTE', null)
  },
}
