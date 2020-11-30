<template>
  <div>
    <h5>コメント投稿</h5>
    <b-form @submit.prevent="onSubmitComment">
      <b-form-textarea
        v-model="commentContent"
        class="mb-3"
        required
      ></b-form-textarea>
      <b-button type="submit" class="float-right" variant="primary"
        >投稿する</b-button
      >
    </b-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { db, FieldValue } from '@/plugins/firebase'
import { authStore } from '@/store'
import { NoteComment } from '@/models'

@Component
class CommentForm extends Vue {
  @Prop({ default: false })
  noteId!: string

  commentContent: string = ''
  get content() {
    return this.commentContent
  }

  async onSubmitComment() {
    console.log(
      new NoteComment({
        content: this.commentContent,
      })
    )

    const result = await this.createComment(
      this.noteId,
      new NoteComment({
        content: this.commentContent,
      })
    )
    console.log(result)

    this.commentContent = ''
  }

  private async createComment(
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
}
export default CommentForm
</script>

<style></style>
