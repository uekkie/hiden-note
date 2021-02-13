import { reactive, toRefs } from '@nuxtjs/composition-api'
import firebase, { db } from '@/plugins/firebase'
import { Note } from '@/models/note'
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
      tags: note.tags.length > 0 ? FieldValue.arrayUnion(...note.tags) : [],
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

  return {
    ...toRefs(state),
    getNote,
    createNote,
    updateNote,
    createComment,
  }
}
export type NoteStore = ReturnType<typeof useNote>
