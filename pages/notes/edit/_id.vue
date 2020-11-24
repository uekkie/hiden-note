<template>
  <note-form
    :title="title"
    :content="content"
    submit-label="更新する"
    @submit="onUpdate"
  ></note-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { Note, NoteHistory } from '@/models/note'

export default Vue.extend({
  data() {
    return {
      title: '' as string,
      content: '' as string,
    }
  },
  computed: {
    ...mapGetters('users', ['currentUserRef', 'userDisplayName']),
  },
  created() {
    this.fetchNote(this.$route.params.id).then((note) => {
      this.title = note.title
      this.content = note.content
    })
  },
  methods: {
    ...mapActions('notes', ['fetchNote', 'updateNote']),
    onUpdate(formData: any) {
      const noteId = this.$route.params.id

      this.updateNote({
        noteId,
        noteHistory: new NoteHistory(
          this.currentUserRef,
          formData.title,
          formData.content
        ),
        userName: this.userDisplayName,
      }).then(() => {
        this.$router.replace({ path: '/notes/' + noteId })
      })
    },
  },
})
</script>
<style></style>
