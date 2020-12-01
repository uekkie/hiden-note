import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

import { db, FieldValue } from '@/plugins/firebase'
import { Note, NoteHistory } from '@/models/note'
import { authStore } from '@/store'

const notesRef = db.collection('notes')

@Module({
  name: 'notes',
  stateFactory: true,
  namespaced: true,
})
class Notes extends VuexModule {
  storedNotes: Note[] = []
  initialized: boolean = false
  storedUnsubscribed?: () => void = undefined

  get notes() {
    return this.storedNotes
  }

  get recentNotes() {
    const dup = this.storedNotes.slice(0)
    return dup.sort((noteA: Note, noteB: Note) =>
      noteA.updatedAt > noteB.updatedAt ? -1 : 0
    )
  }

  @Mutation
  SET_INITIALIZED(value: boolean) {
    this.initialized = value
  }

  @Mutation
  SET_UNSUBSCRIBE(value?: () => void) {
    this.storedUnsubscribed = value
  }

  @Mutation
  CLEAR_STATE() {
    if (this.storedUnsubscribed) {
      this.storedUnsubscribed()
    }
    this.storedUnsubscribed = undefined
    this.initialized = false
    this.storedNotes = []
  }

  @Mutation
  STORE_NOTE(note: Note) {
    this.storedNotes = this.storedNotes.filter((q) => q.id !== note.id)
    this.storedNotes.push(note)
  }

  @Mutation
  CLEAR_NOTES() {
    this.storedNotes = []
  }

  @Mutation
  REMOVE_NOTE(note: Note) {
    this.storedNotes = this.storedNotes.filter((q) => q.id !== note.id)
  }

  @Action
  async initialize() {
    if (this.initialized) {
      return
    }
    await this.storeNotes()
    this.watchNotes()

    this.SET_INITIALIZED(true)
  }

  @Action
  clear() {
    this.CLEAR_STATE()
  }

  @Action
  private watchNotes() {
    const unsubscribe = notesRef.onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        const note = new Note(
          Object.assign({ id: change.doc.id }, change.doc.data())
        )

        if (change.type === 'added' || change.type === 'modified') {
          this.STORE_NOTE(note)
        } else if (change.type === 'removed') {
          this.REMOVE_NOTE(note)
        }
      })
    })
    this.SET_UNSUBSCRIBE(unsubscribe)
  }

  @Action
  async getNote(id: string): Promise<Note> {
    const noteRef = await notesRef.doc(id).get()
    const note = {
      id: noteRef.id,
      ...noteRef.data(),
    }
    return note as Note
  }

  @Action
  async getNoteHistory({
    id,
    historyId,
  }: {
    id: string
    historyId: string
  }): Promise<NoteHistory> {
    const noteHistoryRef = await notesRef
      .doc(id)
      .collection('histories')
      .doc(historyId)
      .get()
    return new NoteHistory({
      id: noteHistoryRef.id,
      ...noteHistoryRef.data(),
    })
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
    const beforeNote = await noteRef.get()
    const beforeContent = beforeNote.get('content')

    // NOTE: 内容（content）に変更がないときは履歴に残さない
    if (beforeContent !== note.content) {
      await noteRef.collection('histories').add({
        content: beforeContent,
        userId: authStore.userId,
        createdAt: FieldValue.serverTimestamp(),
      })
    }

    noteRef.update({
      title: note.title,
      content: note.content,
      tags: note.tags,
      updatedAt: FieldValue.serverTimestamp(),
    })
  }

  @Action
  async storeNotes(limit = 10) {
    this.CLEAR_NOTES()

    const querySnapshot = await notesRef
      .orderBy('updatedAt', 'desc')
      .limit(limit)
      .get()

    querySnapshot.forEach((doc) => {
      this.STORE_NOTE(new Note(Object.assign({ id: doc.id }, doc.data())))
    })
  }

  @Action
  async deleteNote(noteId: string) {
    await notesRef.doc(noteId).delete()
  }

  @Action
  async getNotesByTagName(tagName: string) {
    const querySnapshot = await notesRef
      .where('tags', 'array-contains', tagName)
      .get()

    const notes: Note[] = []
    for (const doc of querySnapshot.docs) {
      notes.push(
        new Note({
          id: doc.id,
          ...doc.data(),
        })
      )
    }
    return notes
  }

  @Action
  async recentNoteHistories({
    noteId,
    limit = 5,
  }: {
    noteId: string
    limit: number
  }) {
    const querySnapshot = await notesRef
      .doc(noteId)
      .collection('histories')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get()
    const histories: NoteHistory[] = []
    for (const doc of querySnapshot.docs) {
      histories.push(
        new NoteHistory({
          id: doc.id,
          ...doc.data(),
        })
      )
    }
    return histories
  }

  @Action
  async fetchTags() {
    const querySnapshot = await notesRef.get()
    const tags = [] as any[]
    querySnapshot.forEach(function (noteSnapshot) {
      tags.push(noteSnapshot.get('tags'))
    })

    return tags
      .flat()
      .filter((elem, index, self) => self.indexOf(elem) === index)
  }
}
export default Notes
