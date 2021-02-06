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
  inject,
  SetupContext,
  reactive,
} from '@nuxtjs/composition-api'
import { Note } from '@/models/note'

import { NoteStore } from '@/composables/use-note'
import NoteKey from '@/composables/use-note-key'
import { AuthStore } from '@/composables/use-auth'
import AuthKey from '@/composables/use-auth-key'
import useRoot from '@/composables/use-root'

export default defineComponent({
  setup(_props, context: SetupContext) {
    const { user } = inject(AuthKey) as AuthStore
    const { createNote } = inject(NoteKey) as NoteStore
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
