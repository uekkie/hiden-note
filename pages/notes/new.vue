<template>
  <note-form :note="note" submit-label="保存する" @submit="onSubmit" />
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { Note } from '@/models/note'

export default Vue.extend({
  data() {
    return {
      note: null as Note | null,
      title: '',
      content: '',
    }
  },
  created() {
    this.note = new Note('', '', [''])
  },
  computed: {
    ...mapGetters('users', ['currentUserRef']),
  },
  methods: {
    ...mapActions('notes', ['createNote']),
    onSubmit(formData: any) {
      this.createNote(
        new Note(
          formData.title,
          formData.content,
          formData.tags,
          this.currentUserRef
        )
      ).then((noteId) => {
        this.$router.replace({ path: '/notes/' + noteId })
      })
    },
  },
})
</script>
<style></style>
