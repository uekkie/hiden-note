import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

import { db, FieldValue } from '@/plugins/firebase'
import { Note, NoteHistory, NoteComment } from '@/models/note'
import { authStore } from '@/store'

@Module({
  name: 'notes',
  stateFactory: true,
  namespaced: true,
})
class Notes extends VuexModule {
  storedNotes: Note[] = []
  initialized: boolean = false
  storedUnsubscribed?: () => void = undefined
  selectedNoteId = ''
  storedComments: NoteComment[] = []
  storedCommentsUnsubscribe?: () => void = undefined

  get notesRef() {
    return db.collection('notes')
  }

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

  @Mutation
  SET_COMMENT_UNSUBSCRIBE(value?: () => void) {
    this.storedCommentsUnsubscribe = value
  }

  @Action({ rawError: true })
  async initialize() {
    if (this.initialized) {
      return
    }
    await this.storeNotes()
    this.watchNotes()

    this.SET_INITIALIZED(true)
  }

  @Action({ rawError: true })
  clear() {
    this.CLEAR_STATE()
  }

  @Action({ rawError: true })
  private watchNotes() {
    const unsubscribe = this.notesRef.onSnapshot((querySnapshot) => {
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

  @Action({ rawError: true })
  async getNote(id: string): Promise<Note> {
    const noteRef = await this.notesRef.doc(id).get()
    const note = {
      id: noteRef.id,
      ...noteRef.data(),
    }
    return note as Note
  }

  @Action({ rawError: true })
  async getNoteHistory({
    id,
    historyId,
  }: {
    id: string
    historyId: string
  }): Promise<NoteHistory> {
    const noteHistoryRef = await this.notesRef
      .doc(id)
      .collection('histories')
      .doc(historyId)
      .get()
    return new NoteHistory({
      id: noteHistoryRef.id,
      ...noteHistoryRef.data(),
    })
  }

  @Action({ rawError: true })
  async createNote(note: Note): Promise<string> {
    const noteRef = await this.notesRef.add({
      userId: authStore.userId,
      title: note.title,
      content: note.content,
      tags: note.tags.length > 0 ? FieldValue.arrayUnion(...note.tags) : [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })
    return noteRef.id
  }

  @Action({ rawError: true })
  async updateNote(note: Note) {
    const noteRef = this.notesRef.doc(note.id)
    const beforeNote = await noteRef.get()
    const beforeTitle = beforeNote.get('title')
    const beforeContent = beforeNote.get('content')

    // タイトルか内容に変更がないときは履歴に残さない
    if (beforeTitle !== note.title || beforeContent !== note.content) {
      await noteRef.collection('histories').add({
        title: beforeTitle,
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

  @Action({ rawError: true })
  async storeNotes(limit = 10) {
    this.CLEAR_NOTES()

    const querySnapshot = await this.notesRef
      .orderBy('updatedAt', 'desc')
      .limit(limit)
      .get()

    querySnapshot.forEach((doc) => {
      this.STORE_NOTE(new Note(Object.assign({ id: doc.id }, doc.data())))
    })
  }

  @Action({ rawError: true })
  async deleteNote(noteId: string) {
    await this.notesRef.doc(noteId).delete()
  }

  @Action({ rawError: true })
  async getNotesByTagName(tagName: string) {
    const querySnapshot = await this.notesRef
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

  @Action({ rawError: true })
  async getNotesCountByTagName(tagName: string) {
    const querySnapshot = await this.notesRef
      .where('tags', 'array-contains', tagName)
      .get()

    return querySnapshot.docs.length
  }

  @Action({ rawError: true })
  async recentNoteHistories({
    noteId,
    limit = 5,
  }: {
    noteId: string
    limit: number
  }) {
    const querySnapshot = await this.notesRef
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

  @Action({ rawError: true })
  async fetchTags({ limit = 5 }: { limit: number }) {
    const querySnapshot = await this.notesRef.get()
    const tags = [] as any[]
    querySnapshot.forEach(function (noteSnapshot) {
      tags.push(noteSnapshot.get('tags'))
    })

    return tags
      .flat()
      .filter((elem, index, self) => self.indexOf(elem) === index)
      .slice(0, limit)
  }

  @Action({ rawError: true })
  async getNotesByUserId(userId: string) {
    if (!userId) {
      console.error('error undefined [userId] !!')

      return []
    }
    const querySnapshot = await this.notesRef
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get()

    const usersNotes: Note[] = []
    for (const doc of querySnapshot.docs) {
      usersNotes.push(
        new Note({
          id: doc.id,
          ...doc.data(),
        })
      )
    }
    return usersNotes
  }

  // ----Comment------

  @Mutation
  STORE_COMMENT(comment: NoteComment) {
    this.storedComments = this.storedComments.filter((q) => q.id !== comment.id)
    this.storedComments.push(comment)
  }

  @Mutation
  REMOVE_COMMENT(comment: NoteComment) {
    this.storedComments = this.storedComments.filter((q) => q.id !== comment.id)
  }

  @Action({ rawError: true })
  createComment({ noteId, content }: { noteId: string; content: string }) {
    this.SET_SELECTED_NOTE_ID(noteId)
    db.collection(`notes/${this.selectedNoteId}/comments`).add({
      userId: authStore.userId,
      content,
      noteId: this.selectedNoteId,
      createdAt: FieldValue.serverTimestamp(),
    })
  }

  @Mutation
  SET_SELECTED_NOTE_ID(value: string) {
    if (this.selectedNoteId !== value) {
      if (this.storedCommentsUnsubscribe) {
        this.storedCommentsUnsubscribe()
      }
      this.storedCommentsUnsubscribe = undefined
      this.storedComments = []
    }
    this.selectedNoteId = value
  }

  @Action({ rawError: true })
  watchNoteComments(noteId: string) {
    this.SET_SELECTED_NOTE_ID(noteId)
    const unsubscribe = this.notesRef
      .doc(noteId)
      .collection('comments')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const noteComment = new NoteComment(
            Object.assign({ id: change.doc.id }, change.doc.data())
          )
          if (this.selectedNoteId !== noteComment.noteId) {
            return
          }
          if (change.type === 'added' || change.type === 'modified') {
            this.STORE_COMMENT(noteComment)
          } else if (change.type === 'removed') {
            this.REMOVE_COMMENT(noteComment)
          }
        })
      })
    this.SET_COMMENT_UNSUBSCRIBE(unsubscribe)
  }

  @Action({ rawError: true })
  async storedNoteComments(noteId: string) {
    const commentsRef = db
      .collection('notes')
      .doc(noteId)
      .collection('comments')
    const querySnapshot = await commentsRef.orderBy('createdAt', 'asc').get()

    querySnapshot.forEach((doc) => {
      this.STORE_COMMENT(
        new NoteComment(Object.assign({ id: doc.id }, doc.data()))
      )
    })
  }
}
export default Notes
