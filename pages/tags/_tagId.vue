<template>
  <b-container>
    <h3>
      タグ <code>#{{ tagName }}</code> が付いているノート
    </h3>
    <notes-container :notes="recentNotes" />
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { notesStore } from '@/store'
import { Note } from '@/models'

@Component
class TagShow extends Vue {
  tagName: string = ''
  notes: Note[] = []

  get recentNotes() {
    return this.notes.sort((noteA, noteB) =>
      noteA.createdAt > noteB.createdAt ? -1 : 0
    )
  }

  async created() {
    this.tagName = this.$route.params.tagId
    this.notes = await notesStore.getNotesByTagName(this.tagName)
  }
}
export default TagShow
</script>

<style lang="sass" scoped>
@import '@/assets/stylesheets/_resources.sass'

.tag-list__header
  color: white
  background-color: $brand-color-light
</style>
