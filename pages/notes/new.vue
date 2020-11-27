<template lang="pug">
  note-form(:note="note" submit-label="保存する" @submit="onSubmit")
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Note } from '@/models/note'
import { notesStore } from '@/store'

@Component
class NoteNew extends Vue {
  note: Note | null = null

  created() {
    this.note = new Note({})
  }

  onSubmit(formData: any) {
    notesStore
      .createNote(
        new Note({
          title: formData.title,
          content: formData.content,
          tags: formData.tags,
        })
      )
      .then((noteId) => {
        this.$router.replace({ path: '/notes/' + noteId })
      })
  }
}
export default NoteNew
</script>
