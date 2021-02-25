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
import { defineComponent, reactive } from '@nuxtjs/composition-api'
import { useNoteStore } from '@/composables/use-note'
import { useAuthStore } from '@/composables/use-auth'

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
    const { createComment } = useNoteStore()
    const { user, isValid } = useAuthStore()

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
