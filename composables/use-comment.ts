import { reactive, toRefs, provide, inject } from '@nuxtjs/composition-api'
import { db } from '@/plugins/firebase'
import { NoteComment } from '@/models/comment'
import { InjectionKey } from '@vue/composition-api'

const CommentKey: InjectionKey<CommentStore> = Symbol('CommentStore')

export function provideCommentStore() {
  provide(CommentKey, useComment())
}

export function useCommentStore() {
  return inject(CommentKey) as CommentStore
}

type State = {
  comments: NoteComment[]
  unsubscribe: (() => void) | undefined
}

function useComment() {
  const state = reactive<State>({
    comments: [],
    unsubscribe: undefined,
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

  const watchComments = async (noteId: string) => {
    state.comments = []
    state.unsubscribe = await db
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

  return {
    ...toRefs(state),
    fetchComments,
    watchComments,
  }
}
export type CommentStore = ReturnType<typeof useComment>
