import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

import { db, FieldValue } from '@/plugins/firebase'
import { Note } from '@/models/note'
import { authStore } from '@/store'
const notesRef = db.collection('notes')

@Module({
  name: 'notes',
  stateFactory: true,
  namespaced: true,
})
class Notes extends VuexModule {
  storedNotes: Note[] = []

  @Action
  async getNote(id: string): Promise<Note> {
    const noteRef = await notesRef.doc(id).get()
    const note = {
      id: noteRef.id,
      ...noteRef.data(),
    }
    return note as Note
  }

  get getNotes() {
    return this.storedNotes
  }

  @Mutation
  CLEAR_NOTES() {
    this.storedNotes = []
  }

  @Mutation
  APPEND_TO_NOTES(data: any) {
    this.storedNotes.push(data)
  }

  @Action
  async createNote(note: Note): Promise<string> {
    const noteRef = await notesRef.add({
      userId: authStore.userId,
      title: note.title,
      content: note.content,
      tags: note.tags.length > 0 ? FieldValue.arrayUnion(...note.tags) : [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })
    return noteRef.id
  }

  @Action
  async updateNote(note: Note) {
    const noteRef = notesRef.doc(note.id)

    noteRef.update({
      title: note.title,
      content: note.content,
      tags: note.tags,
      updatedAt: FieldValue.serverTimestamp(),
    })

    await noteRef.collection('histories').add({
      content: note.content,
      userRef: authStore.currentUserRef,
      createdAt: FieldValue.serverTimestamp(),
    })
  }

  @Action
  async fetchNotes(limit = 5) {
    this.CLEAR_NOTES()

    const ref = await notesRef.orderBy('updatedAt', 'desc').limit(limit).get()

    ref.docs.forEach((data) => {
      this.APPEND_TO_NOTES({ id: data.id, ...data.data() })
    })
  }

  @Action
  async deleteNote(noteId: string) {
    await notesRef.doc(noteId).delete()
  }
}
export default Notes
