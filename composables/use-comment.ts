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
}

function useComment() {
  const state = reactive<State>({
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
