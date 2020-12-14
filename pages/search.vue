<template>
  <b-container>
    <b-form @submit.prevent="searchNote">
      <label for="text-keyword">検索キ-ワード</label>
      <b-form-input v-model.trim="query" type="text" />
    </b-form>
    <div
      v-for="note in noteList"
      :key="note.id"
      class="my-2 flex-column align-items-start"
    >
      <h3>
        <nuxt-link :to="`/notes/${note.id}`">{{ note.title }}</nuxt-link>
      </h3>
      <div>
        <small>
          <b-img v-bind="photoProps(note.userId)" rounded="circle"></b-img>
          <NuxtLink :to="`/users/${note.userId}`">
            {{ userName(note.userId) }}
          </NuxtLink>
        </small>
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="content" v-html="formattedContent(note.content)" />
      <div class="text-right">
        <small>{{ note.updatedAt }}</small>
      </div>
      <hr />
    </div>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { algoliaClient } from '@/utils/algolia'
import { usersStore } from '@/store'
const index = algoliaClient().initIndex('notes')
const md = require('markdown-it')().use(require('markdown-it-highlightjs'), {
  inline: true,
  html: false,
  linkify: true,
  breaks: true,
})

@Component
class SearchIndex extends Vue {
  private noteList: any[] = []
  private query: string = ''

  get canSubmit(): boolean {
    if (!this.query) return false
    return this.query.length > 0
  }

  get users() {
    return usersStore.users
  }

  fetch() {
    this.query = this.$route.query.q as string
    this.queryNote()
  }

  searchNote() {
    if (this.query.length > 0) {
      this.$router.push({
        path: 'search',
        query: { q: this.query },
      })
      this.queryNote()
    }
  }

  async queryNote() {
    const searchResult = await index.search(this.query)
    this.noteList = searchResult.hits
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
}
export default SearchIndex
</script>
