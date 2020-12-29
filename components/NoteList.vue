<template>
  <div class="note-list">
    <h3>ノート一覧</h3>
    <p>ノート総数：{{ notes.length }}</p>

    <div
      v-for="(note, index) in notes"
      :key="index"
      class="note-list__note flex-column align-items-start mb-3"
    >
      <div class="note-list__note-author">
        <div class="note-list__note-author-pic mr-3">
          <nuxt-link :to="`/users/${note.userId}`">
            <b-img
              thumbnail
              v-bind="photoProps(note.userId)"
              rounded="circle"
            ></b-img>
          </nuxt-link>
        </div>
        <div>
          <nuxt-link
            class="note-list__note-author-link"
            :to="`/users/${note.userId}`"
          >
            {{ userName(note.userId) }}
          </nuxt-link>
          <br />
          <time>
            <small>{{ formatDate(note.updatedAt.toDate()) }}</small>
          </time>
        </div>
      </div>
      <div class="note-list__note-dody">
        <h3>
          <nuxt-link :to="`/notes/${note.id}`">{{ note.title }}</nuxt-link>
        </h3>

        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="content" v-html="formattedContent(note.content)" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { DateTime } from 'luxon'
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

  photoProps(userId: string) {
    return {
      width: 32,
      height: 32,
      class: 'm1',
      src: this.userPhotoURL(userId),
    }
  }

  formatDate(date: Date): string {
    return DateTime.fromJSDate(date).toISODate()
  }
}
export default NoteList
</script>

<style lang="sass" scoped>
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
