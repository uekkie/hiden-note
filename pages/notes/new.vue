<template>
  <note-form
    :note="note"
    submit-label="保存する"
    @submit="onSubmit"
  ></note-form>
</template>

<script lang="ts">
import {
  defineComponent,
  SetupContext,
  reactive,
} from '@nuxtjs/composition-api'
import { Note } from '@/models/note'
import { useNoteStore } from '@/composables/use-note'
import { useAuthStore } from '@/composables/use-auth'

export default defineComponent({
  setup(_props, context: SetupContext) {
    const { user } = useAuthStore()
    const { createNote } = useNoteStore()
    const note = reactive<Note>(new Note({}))
    const router = context.root.$router

    const onSubmit = (formData: any) => {
      createNote(
        user?.value?.id!,
        new Note({
          title: formData.title,
          content: formData.content,
          tags: formData.tags,
        })
      ).then((noteId) => {
        router.replace({ path: '/notes/' + noteId })
      })
    }
    return {
      onSubmit,
      note,
    }
  },
})
</script>
