import { reactive, toRefs } from '@nuxtjs/composition-api'
import firebase, { db } from '@/plugins/firebase'
import { Note, NoteHistory } from '@/models/note'
const FieldValue = firebase.firestore.FieldValue

export default function useNote() {
  const state = reactive<{
    notes: Note[]
    selectedNoteId: string | undefined
  }>({
    notes: [],
    selectedNoteId: undefined,
  })

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
      // tags: note.tags.length > 0 ? FieldValue.arrayUnion(...note.tags) : [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })
    return noteRef.id
  }
  const updateNote = async (note: Note) => {
    console.log('update note ', note)

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

  return {
    ...toRefs(state),
    getNote,
    createNote,
    updateNote,
    createComment,
    getNoteHistory,
    getNotesByUserId,
    getNotesByTagName,
  }
}
export type NoteStore = ReturnType<typeof useNote>
