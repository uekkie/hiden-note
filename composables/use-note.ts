import { reactive, toRefs, provide, inject } from '@nuxtjs/composition-api'
import firebase, { db } from '@/plugins/firebase'
import { Note, NoteHistory } from '@/models/note'
import { InjectionKey } from '@vue/composition-api'

const FieldValue = firebase.firestore.FieldValue
const NoteKey: InjectionKey<NoteStore> = Symbol('NoteStore')

export function provideNoteStore() {
  provide(NoteKey, useNote())
}
export function useNoteStore() {
  return inject(NoteKey) as NoteStore
}

export default function useNote() {
  const state = reactive<{
    notes: Note[]
    selectedNoteId: string | undefined
    unsubscribe: (() => void) | undefined
  }>({
    notes: [],
    selectedNoteId: undefined,
    unsubscribe: undefined,
  })

  const watchNotes = async () => {
    state.notes = []
    state.unsubscribe = await db
      .collection('notes')
      .orderBy('updatedAt', 'desc')
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            state.notes.push(
              new Note({ id: change.doc.id, ...change.doc.data() })
            )
          }
          if (change.type === 'modified') {
            state.notes = state.notes.filter(
              (note) => note.id !== change.doc.id
            )
            state.notes.push(
              new Note({ id: change.doc.id, ...change.doc.data() })
            )
          }
          if (change.type === 'removed') {
            state.notes = state.notes.filter(
              (note) => note.id !== change.doc.id
            )
          }
        })
      })
  }
  const unsubscribeNotes = () => {
    if (state.unsubscribe) {
      state.unsubscribe()
      state.unsubscribe = undefined
    }
  }

  const getNote = async (noteId: string): Promise<Note> => {
    const noteRef = await db.collection('notes').doc(noteId).get()
    return {
      id: noteRef.id,
      ...noteRef.data(),
    } as Note
  }
  const createNote = async (uid: string, note: Note): Promise<string> => {
    const noteRef = await db.collection('notes').add({
      userId: uid,
      title: note.title,
      content: note.content,
      tags: note.tags,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })
    return noteRef.id
  }
  const updateNote = async (note: Note) => {
    const noteRef = db.collection('notes').doc(note.id)
    const beforeNote = await noteRef.get()
    const beforeContent = beforeNote.get('content')

    // NOTE: 内容（content）に変更がないときは履歴に残さない
    if (beforeContent !== note.content) {
      await noteRef.collection('histories').add({
        content: beforeContent,
        userId: note.userId,
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
  const createComment = ({
    userId,
    noteId,
    content,
  }: {
    userId: string
    noteId: string
    content: string
  }) => {
    state.selectedNoteId = noteId
    return db.collection(`notes/${state.selectedNoteId}/comments`).add({
      userId,
      content,
      noteId: state.selectedNoteId,
      createdAt: FieldValue.serverTimestamp(),
    })
  }
  const getNoteHistory = async ({
    id,
    historyId,
  }: {
    id: string
    historyId: string
  }): Promise<NoteHistory> => {
    const noteHistoryRef = await db
      .collection('notes')
      .doc(id)
      .collection('histories')
      .doc(historyId)
      .get()
    return new NoteHistory({
      id: noteHistoryRef.id,
      ...noteHistoryRef.data(),
    })
  }

  const deleteNote = async (noteId: string) => {
    await db.collection('notes').doc(noteId).delete()
  }
  const getNotesByUserId = async (userId: string) => {
    if (!userId) {
      console.error('error undefined [userId] !!')
      return []
    }
    const querySnapshot = await db
      .collection('notes')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
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

  const getNotesByTagName = async (tagName: string) => {
    const querySnapshot = await db
      .collection('notes')
      .where(`tags.${tagName}`, '==', true)
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

  const recentNoteHistories = async ({
    noteId,
    limit = 5,
  }: {
    noteId: string
    limit: number
  }) => {
    const querySnapshot = await db
      .collection('notes')
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

  return {
    ...toRefs(state),
    getNote,
    createNote,
    updateNote,
    createComment,
    getNoteHistory,
    getNotesByUserId,
    getNotesByTagName,
    watchNotes,
    unsubscribeNotes,
    recentNoteHistories,
    deleteNote,
  }
}
export type NoteStore = ReturnType<typeof useNote>
