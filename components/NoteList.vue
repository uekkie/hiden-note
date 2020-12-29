<template>
  <div class="notes">
    <h3>ノート一覧</h3>
    <p>ノート総数：{{ notes.length }}</p>

    <div
      v-for="(note, index) in notes"
      :key="index"
      class="flex-column align-items-start"
    >
      <h3>
        <nuxt-link :to="`/notes/${note.id}`">{{ note.title }}</nuxt-link>
      </h3>
      <div>
        <small>
          <b-img v-bind="photoProps(note.userId)" rounded="circle"></b-img>
          <nuxt-link :to="`/users/${note.userId}`">
            {{ userName(note.userId) }}
          </nuxt-link>
        </small>
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="content" v-html="formattedContent(note.content)" />
      <div class="text-right">
        <small>{{ formatDate(note.updatedAt.toDate()) }}</small>
      </div>
      <hr />
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
