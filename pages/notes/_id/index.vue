<template>
  <b-container v-if="!loading">
    <b-row>
      <b-col cols="8">
        <note-content
          :note="getCurrentNote"
          :user="user(getCurrentNote.userId)"
          @onDeleteNote="onDeleteNote"
        />

        <div class="note--comment-list my-3">
          <h5>コメント一覧</h5>
          <comment-list :note-id="noteId"></comment-list>
        </div>
        <div class="note--comment-form mt-3">
          <h5>コメント投稿</h5>
          <comment-form :note-id="noteId"></comment-form>
        </div>
      </b-col>
      <b-col cols="4">
        <note-editor-container
          :note-id="getCurrentNote.id"
        ></note-editor-container>
        <related-note-container
          class="mt-4"
          :related-notes="relatedNotes"
        ></related-note-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { notesStore, usersStore } from '@/store'
import 'highlight.js/styles/atom-one-light.css'

@Component
class NoteShow extends Vue {
  private loading: boolean = true

  get users() {
    return usersStore.users
  }

  get noteId() {
    return this.getCurrentNote?.id || ''
  }

  get relatedNotes() {
    return notesStore.storedRelatedNotes
  }

  get getCurrentNote() {
    return notesStore.getCurrentNote
  }

  async created() {
    await notesStore.setCurrentNoteById(this.$route.params.id)
    await notesStore.storeRelatedNotes()
    this.loading = false
  }

  async onDeleteNote(bvModalEvt: any) {
    bvModalEvt.preventDefault()
    await notesStore.deleteNote(this.$route.params.id)
    this.$router.push('/')
  }

  user(userId: string) {
    return this.users.find((user) => user.id === userId)
  }
}
export default NoteShow
</script>
