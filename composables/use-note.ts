import { reactive, toRefs } from '@nuxtjs/composition-api'
import firebase, { db } from '@/plugins/firebase'
import { Note } from '@/models/note'
const FieldValue = firebase.firestore.FieldValue

export default function useNote() {
  const state = reactive<{
    notes: Note[]
  }>({
    notes: [],
  })

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

  return {
    ...toRefs(state),
    createNote,
  }
}
export type NoteStore = ReturnType<typeof useNote>
