<template>
  <div>
    <b-form @submit.prevent="onSubmitComment">
      <b-form-textarea v-model="commentContent" class="mb-3" required />
      <b-button type="submit" class="float-right" variant="primary">
        投稿する
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { notesStore } from '@/store'

@Component
class CommentForm extends Vue {
  @Prop({ default: false })
  noteId!: string

  private commentContent: string = ''

  get content() {
    return this.commentContent
  }

  async onSubmitComment() {
    await notesStore.createComment({
      noteId: this.noteId,
      content: this.commentContent,
    })
    this.commentContent = ''
  }
}
export default CommentForm
</script>
