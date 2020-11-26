<template>
  <note-form :note="note" submit-label="保存する" @submit="onSubmit" />
</template>

<script lang="ts">
import Vue from 'vue'
import { Note } from '@/models/note'
import { notesStore, authStore } from '@/store'

export default Vue.extend({
  data() {
    return {
      note: null as Note | null,
    }
  },
  created() {
    this.note = new Note({})
  },
  methods: {
    onSubmit(formData: any) {
      notesStore
        .createNote(
          new Note({
            title: formData.title,
            content: formData.content,
            tags: formData.tags,
            userId: authStore.userId,
          })
        )
        .then((noteId) => {
          this.$router.replace({ path: '/notes/' + noteId })
        })
    },
  },
})
</script>
<style></style>
