<template>
  <div class="notes-container">
    <div
      v-for="(note, index) in notes"
      :key="index"
      class="notes-container__note flex-column align-items-start mb-3"
    >
      <note-list-item :note="note" :user="user(note.userId)" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { notesStore, usersStore } from '@/store'
import { Note } from '@/models'

@Component
class NotesContainer extends Vue {
  @Prop({
    default: false,
    required: true,
  })
  notes!: Note[]

  get users() {
    return usersStore.users
  }

  async fetch() {
    await notesStore.initialize()
    await usersStore.initialize()
  }

  user(userId: string) {
    return this.users.find((user) => user.id === userId)
  }
}
export default NotesContainer
</script>

<style lang="sass">
@import '@/assets/stylesheets/_resources.sass'

.notes-container__note-author
  display: flex
  align-items: center
  justify-content: flex-start
.notes-container__note-author-pic
  width: 32px
  height: 32px
.notes-container__note-author-link
  color: black
  &:hover
    text-decoration: none
    color: #333
.notes-container__note
  background: $note-background
  box-shadow: 0 0 0 1px #ddd
  border-radius: 5px
  padding: 1rem
.notes-container__note-dody
  padding-left: 3rem
</style>
