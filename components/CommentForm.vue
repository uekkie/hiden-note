<template>
  <div>
    <h5>コメント投稿</h5>
    <b-form @submit.prevent="onSubmitComment">
      <b-form-textarea v-model="commentContent" class="mb-3" required />
      <b-button type="submit" class="float-right" variant="primary">
        投稿する
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@nuxtjs/composition-api'
import { notesStore } from '@/store'

export default defineComponent({
  props: {
    noteId: {
      type: String,
      require: true,
    },
  },
  setup(props) {
    const state = reactive({
      commentContent: '',
    })
    const content = () => {
      return state.commentContent
    }

    const onSubmitComment = async () => {
      await notesStore.createComment({
        noteId: props.noteId!,
        content: state.commentContent,
      })
      state.commentContent = ''
    }
    return { state, content, onSubmitComment }
  },
})
</script>
