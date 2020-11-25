import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { db, firebase } from '@/plugins/firebase'
import { Note } from '@/models/note'

const notesRef = db.collection('notes')

const getNote = async (id: string): Promise<Note> => {
  const noteRef = await notesRef.doc(id).get()
  const note = {
    title: noteRef.get('title'),
    content: noteRef.get('content'),
    tags: noteRef.get('tags'),
  }
  return note as Note
}

const state = () => ({
  note: null as Note | null,
  notes: [] as any[],
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
  async createNote(_, note): Promise<string> {
    const noteRef = await notesRef.add({
      title: note.title,
      content: note.content,
      tags:
        note.tags.length > 0
          ? firebase.firestore.FieldValue.arrayUnion(...note.tags)
          : [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
    return noteRef.id
  },
  async fetchNote({ commit }, noteId): Promise<Note> {
    const note = await getNote(noteId)
    commit('SET_NOTE', note)
    return note
  },
  async updateNote({ rootGetters }, payload) {
    const noteRef = notesRef.doc(payload.noteId)

    noteRef.update({
      title: payload.title,
      content: payload.content,
      tags: payload.tags,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

    await noteRef.collection('histories').add({
      content: payload.content,
      userRef: rootGetters['users/currentUserRef'],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
  },
  async fetchNotes({ commit }, limit = 5) {
    commit('CLEAR_NOTES')

    const ref = await notesRef.orderBy('updatedAt', 'desc').limit(limit).get()

    ref.docs.forEach((data) => {
      commit('APPEND_TO_NOTES', { id: data.id, ...data.data() })
    })
  },
  async deleteNote({ commit, dispatch }, noteId) {
    await notesRef.doc(noteId).delete()
    dispatch('fetchNotes')
    commit('SET_NOTE', null)
  },
}
