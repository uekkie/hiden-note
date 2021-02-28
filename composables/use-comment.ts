import { reactive, toRefs } from '@nuxtjs/composition-api'
import { db } from '@/plugins/firebase'
import { NoteComment } from '@/models/comment'

type State = {
  comments: NoteComment[]
  unsubscribe: (() => void) | undefined
}

export function useNoteComment(noteId: string) {
  const state = reactive<State>({
    comments: [],
    unsubscribe: undefined,
  })

  const watchComments = (noteId: string) => {
    if (state.unsubscribe) {
      return
    }
    state.comments = []
    state.unsubscribe = db
      .collection('notes')
      .doc(noteId)
      .collection('comments')
      .orderBy('createdAt', 'asc')
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            state.comments.push(
              new NoteComment({ id: change.doc.id, ...change.doc.data() })
            )
          }
          if (change.type === 'modified') {
            state.comments = state.comments.filter(
              (comment) => comment.id !== change.doc.id
            )
            state.comments.push(
              new NoteComment({ id: change.doc.id, ...change.doc.data() })
            )
          }
          if (change.type === 'removed') {
            state.comments = state.comments.filter(
              (comment) => comment.id !== change.doc.id
            )
          }
        })
      })
  }
  watchComments(noteId)

  return {
    ...toRefs(state),
  }
}
