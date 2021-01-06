<template>
  <b-container>
    <div
      v-for="note in NotesContainer"
      :key="note.id"
      class="my-2 flex-column align-items-start note"
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

  async fetch() {
    this.query = this.$route.query.q as string
    await this.queryNote()
  }

  async queryNote() {
    const searchResult = await index.search(this.query)
    this.NotesContainer = searchResult.hits
  }
}
export default SearchIndex
</script>

<style lang="sass">
@import '@/assets/stylesheets/_resources.sass'
.note
  background: $note-background
  box-shadow: 0 0 0 1px #ddd
  border-radius: 5px
  padding: 1rem
</style>
