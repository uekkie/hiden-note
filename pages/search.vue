<template>
  <b-container>
    <b-form @submit.prevent="searchNote">
      <label for="text-keyword">検索キ-ワード</label>
      <b-form-input v-model.trim="query" type="text" />
    </b-form>

    <div
      v-for="note in NotesContainer"
      :key="note.id"
      class="my-2 flex-column align-items-start"
    >
      <h3>
        <nuxt-link :to="`/notes/${note.id}`">{{ note.title }}</nuxt-link>
      </h3>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="note--body mt-5 ml-3">
        <markdown-preview :content="note.content"></markdown-preview>
      </div>
      <div class="text-right">
        <time-label v-if="note.updatedAt" :datetime="note.updatedAt" />
      </div>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { algoliaClient } from '@/utils/algolia'
const index = algoliaClient().initIndex('notes')

@Component
class SearchIndex extends Vue {
  private NotesContainer: any[] = []
  private query: string = ''

  get canSubmit(): boolean {
    if (!this.query) return false
    return this.query.length > 0
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
    this.NotesContainer = searchResult.hits
    // .sort((resultA, resultB) =>
    //   resultA.updatedAt > resultB.updatedAt ? -1 : 0
    // )
  }
}
export default SearchIndex
</script>
