<template>
  <note-form
    :title="title"
    :content="content"
    submit-label="保存する"
    @submit="onSubmit"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { Note } from '@/models/note'

export default Vue.extend({
  data() {
    return {
      title: '',
      content: '',
    }
  },
  computed: {
    ...mapGetters('users', ['currentUserRef']),
  },
  methods: {
    ...mapActions('notes', ['createNote']),
    onSubmit(formData: any) {
      this.createNote(
        new Note(this.currentUserRef, formData.title, formData.content)
      ).then((noteId) => {
        this.$router.replace({ path: '/notes/' + noteId })
      })
    },
  },
})
</script>
<style></style>
