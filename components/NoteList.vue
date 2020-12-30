<template>
  <div class="note-list">
    <div
      v-for="(note, index) in notes"
      :key="index"
      class="note-list__note flex-column align-items-start mb-3"
    >
      <note-list-item :note="note" :user="user(note.userId)" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { notesStore, usersStore } from '@/store'

const md = require('markdown-it')().use(require('markdown-it-highlightjs'), {
  inline: true,
  html: false,
  linkify: true,
  breaks: true,
})

@Component
class NoteList extends Vue {
  get notes() {
    return notesStore.recentNotes
  }

  get users() {
    return usersStore.users
  }

  async created() {
    await notesStore.initialize()
  }

  formattedContent(content: string): string {
    return md.render(content)
  }

  userName(userId: string) {
    return this.users.find((user) => user.id === userId)?.displayName
  }

  userPhotoURL(userId: string) {
    return this.users.find((user) => user.id === userId)?.photoURL
  }

  user(userId: string) {
    return this.users.find((user) => user.id === userId)
  }
}
export default NoteList
</script>

<style lang="sass">
@import '@/assets/stylesheets/_resources.sass'

.note-list__note-author
  display: flex
  align-items: center
  justify-content: start
.note-list__note-author-pic
  width: 32px
  height: 32px
.note-list__note-author-link
  color: black
  &:hover
    text-decoration: none
    color: #333
.note-list__note
  background: $note-background
  box-shadow: 0 0 0 1px #ddd
  border-radius: 5px
  padding: 1rem
.note-list__note-dody
  padding-left: 3rem
</style>
