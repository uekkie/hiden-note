<template>
  <note-form
    :note="note"
    submit-label="保存する"
    @submit="onSubmit"
  ></note-form>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Note } from '@/models/note'
import { notesStore } from '@/store'
import { arrayToHash } from '@/utils/tags'

@Component
class NoteNew extends Vue {
  note: Note | null = null

  created() {
    this.note = new Note({})
  }

  onSubmit(formData: any) {
    const tagsHash = arrayToHash(formData.tags)
    notesStore
      .createNote(
        new Note({
          title: formData.title,
          content: formData.content,
          tags: tagsHash,
        })
      )
      .then((noteId) => {
        this.$router.replace({ path: '/notes/' + noteId })
      })
  }
}
export default NoteNew
</script>
