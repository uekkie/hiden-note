<template>
  <div>
    <h3 class="note-editor__title">更新した人たち</h3>
    <div class="note-editor-list">
      <b-list-group-item v-for="(history, index) in noteHistories" :key="index">
        <note-editor-list-item
          :note-id="noteId"
          :history="history"
          :user="user(history.userId)"
        />
      </b-list-group-item>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { notesStore, usersStore } from '@/store'
import { User } from '@/models'
import { NoteHistory } from '@/models/note'

@Component
class NoteEditorContainer extends Vue {
  @Prop({ default: false })
  noteId!: string

  private noteHistories: NoteHistory[] = []
  private users: User[] = []

  async created() {
    await notesStore.initialize()
    await usersStore.initialize()

    this.noteHistories = await notesStore.recentNoteHistories({
      noteId: this.noteId,
      limit: 5,
    })
    this.users = usersStore.users
  }

  user(userId: string): User | undefined {
    return this.users.find((user) => {
      return user.id === userId
    })
  }
}
export default NoteEditorContainer
</script>

<style lang="sass">
@import '@/assets/stylesheets/_resources.sass'
.note-editor__title
  font-size: 1rem
.note-editor-list
  background: $note-background
  box-shadow: 0 0 0 1px #ddd
  border-radius: 5px
  padding: 1rem
</style>
