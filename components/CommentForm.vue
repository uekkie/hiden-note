<template>
  <div>
    <h5>コメント投稿</h5>
    <b-form @submit.prevent="onSubmitComment">
      <b-form-textarea v-model="state.comment" class="mb-3" required />
      <b-button type="submit" class="float-right" variant="primary">
        投稿する
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, inject } from '@nuxtjs/composition-api'
import { NoteStore } from '@/composables/use-note'
import NoteKey from '@/composables/use-note-key'
import { AuthStore } from '@/composables/use-auth'
import AuthKey from '@/composables/use-auth-key'

export default defineComponent({
  props: {
    noteId: {
      type: String,
      require: true,
    },
  },
  setup(props) {
    const state = reactive({
      comment: '',
    })
    const content = () => {
      return state.comment
    }
    const { createComment } = inject(NoteKey) as NoteStore
    const { user, isValid } = inject(AuthKey) as AuthStore

    if (!isValid) {
      console.error('Not auth')
      return
    }

    const onSubmitComment = async () => {
      await createComment({
        userId: user?.value?.id!,
        noteId: props.noteId!,
        content: state.comment,
      })
      state.comment = ''
    }
    return { state, content, onSubmitComment }
  },
})
</script>
