<template>
  <note-form
    v-if="note"
    :note="note"
    submit-label="更新する"
    @submit="onUpdate"
  ></note-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { Note } from '@/models/note'
import { authStore, notesStore } from '@/store'

export default Vue.extend({
  data() {
    return {
      note: null as Note | null,
    }
  },
  created() {
    notesStore.getNote(this.$route.params.id).then((note) => {
      this.note = note
    })
  },
  methods: {
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
    },
  },
})
</script>
<style></style>
