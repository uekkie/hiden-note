import { Module, VuexModule, Action } from 'vuex-module-decorators'

import { db, FieldValue } from '@/plugins/firebase'
import { NoteComment } from '@/models'
import { authStore } from '@/store'

@Module({
  name: 'comments',
  stateFactory: true,
  namespaced: true,
})
class Comments extends VuexModule {
  @Action({ rawError: true })
  public async createComment(
    noteId: string,
    comment: NoteComment
  ): Promise<boolean> {
    const commentDocRef = await db
      .collection('notes')
      .doc(noteId)
      .collection('comments')
      .add({
        userId: authStore.userId,
        content: comment.content,
        createdAt: FieldValue.serverTimestamp(),
      })
    return commentDocRef.id !== ''
  }

  @Action({ rawError: true })
  async getNoteComments(noteId: string): Promise<NoteComment[]> {
    const commentsRef = db
      .collection('notes')
      .doc(noteId)
      .collection('comments')
    const querySnapshot = await commentsRef.orderBy('createdAt', 'desc').get()
    const comments: NoteComment[] = []
    querySnapshot.forEach((doc) => {
      comments.push(new NoteComment(Object.assign({ id: doc.id }, doc.data())))
    })
    return comments
  }
}
export default Comments
