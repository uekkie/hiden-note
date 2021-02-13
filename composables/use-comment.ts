import { reactive, toRefs } from '@nuxtjs/composition-api'
import { db } from '@/plugins/firebase'
import { NoteComment } from '@/models/comment'
// const FieldValue = firebase.firestore.FieldValue

export default function useComment() {
  const state = reactive<{
    comments: NoteComment[]
  }>({
    comments: [],
  })

  const clear = () => {
    state.comments = []
  }

  const fetchComments = async (noteId: string) => {
    clear()

    const querySnapshot = await db
      .collection('notes')
      .doc(noteId)
      .collection('comments')
      .orderBy('createdAt', 'asc')
      .get()

    for (const comment of querySnapshot.docs) {
      state.comments.push(
        new NoteComment(Object.assign({ id: comment.id }, comment.data()))
      )
    }
  }

  return {
    ...toRefs(state),
    fetchComments,
  }
}
export type CommentStore = ReturnType<typeof useComment>
