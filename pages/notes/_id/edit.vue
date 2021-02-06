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
import {
  defineComponent,
  reactive,
  inject,
  useAsync,
} from '@nuxtjs/composition-api'
import { Note } from '@/models/note'
// import { authStore, notesStore } from '@/store'
import 'highlight.js/styles/atom-one-light.css'
import NoteKey from '~/composables/use-note-key'
import { NoteStore } from '~/composables/use-note'

export default defineComponent({
  setup(_props, ctx) {
    const { getNote } = inject(NoteKey) as NoteStore
    const noteId = ctx.root.$route.params.id
    // todo getNoteを実装する
    const note = useAsync(() => getNote(noteId))
    return {
      note,
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
