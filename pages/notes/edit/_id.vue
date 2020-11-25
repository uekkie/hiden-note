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
import { mapGetters, mapActions } from 'vuex'
import { Note } from '@/models/note'

export default Vue.extend({
  data() {
    return {
      note: null as Note | null,
      title: '' as string,
      content: '' as string,
    }
  },
  computed: {
    ...mapGetters('users', ['currentUserRef', 'userDisplayName']),
  },
  created() {
    this.fetchNote(this.$route.params.id).then((note) => {
      this.note = note
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
        userRef: this.currentUserRef,
        title: formData.title,
        content: formData.content,
        tags: formData.tags,
        userName: this.userDisplayName,
      }).then(() => {
        this.$router.replace({ path: '/notes/' + noteId })
      })
    },
  },
})
</script>
<style></style>
