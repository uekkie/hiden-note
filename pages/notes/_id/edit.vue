<template lang="pug">
  note-form(
    v-if="note"
    :note="note"
    submit-label="更新する"
    @submit="onUpdate")
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Note } from '@/models/note'
import { authStore, notesStore } from '@/store'

@Component
class NoteEdit extends Vue {
  note: Note | null = null

  created() {
    notesStore.getNote(this.$route.params.id).then((note) => {
      this.note = note
    })
  }

  onUpdate(formData: any) {
    const noteId = this.$route.params.id

    notesStore
      .updateNote(
        new Note({
          id: noteId,
          userId: authStore.userId,
          title: formData.title,
          content: formData.content,
          tags: formData.tags,
        })
      )
      .then(() => {
        this.$router.replace({ path: '/notes/' + noteId })
      })
  }
}
export default NoteEdit
</script>
