<template>
  <note-form
    v-if="note"
    :note="note"
    submit-label="更新する"
    @submit="onUpdate"
  />
</template>

<script lang="ts">
// import { Vue, Component } from 'nuxt-property-decorator'
import { defineComponent, inject, useAsync } from '@nuxtjs/composition-api'
import { Note } from '@/models/note'
// import { authStore, notesStore } from '@/store'
import 'highlight.js/styles/atom-one-light.css'
import NoteKey from '~/composables/use-note-key'
import { NoteStore } from '~/composables/use-note'
import AuthKey from '~/composables/use-auth-key'
import { AuthStore } from '~/composables/use-auth'

export default defineComponent({
  setup(_props, ctx) {
    const { getNote, updateNote } = inject(NoteKey) as NoteStore
    const { user } = inject(AuthKey) as AuthStore
    const noteId = ctx.root.$route.params.id
    const note = useAsync(() => getNote(noteId))

    const onUpdate = (formData: any) => {
      const noteId = ctx.root.$route.params.id

      updateNote(
        new Note({
          id: noteId,
          userId: user?.value?.id,
          title: formData.title,
          content: formData.content,
          tags: formData.tags,
        })
      ).then(() => {
        ctx.root.$router.replace({ path: '/notes/' + noteId })
      })
    }

    return {
      note,
      onUpdate,
    }
  },
})

// @Component
// class NoteEdit extends Vue {
//   private note: Note | null = null

//   created() {
//     notesStore.getNote(this.$route.params.id).then((note) => {
//       this.note = note
//     })
//   }

//   onUpdate(formData: any) {
//     const noteId = this.$route.params.id

//     notesStore
//       .updateNote(
//         new Note({
//           id: noteId,
//           userId: authStore.userId,
//           title: formData.title,
//           content: formData.content,
//           tags: formData.tags,
//         })
//       )
//       .then(() => {
//         this.$router.replace({ path: '/notes/' + noteId })
//       })
//   }
// }
// export default NoteEdit
//
</script>
