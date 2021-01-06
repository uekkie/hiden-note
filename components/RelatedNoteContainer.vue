<template>
  <div class="related-notes-container">
    <h3 class="related-notes__title">おなじタグの付いたノート</h3>
    <div class="related-notes__items">
      <b-list-group>
        <b-list-group-item v-for="note in relatedNotes" :key="note.id">
          <nuxt-link :to="`/notes/${note.id}`">{{ note.title }}</nuxt-link>
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { notesStore } from '@/store'
import { Note } from '@/models/note'

@Component
class RelatedNotesContainer extends Vue {
  @Prop({ default: false })
  relatedNotes!: Note[]

  async created() {
    await notesStore.initialize()
  }
}
export default RelatedNotesContainer
</script>

<style lang="sass">
@import '@/assets/stylesheets/_resources.sass'
.related-notes__title
  font-size: 1rem
.related-notes__items
  background: $note-background
  box-shadow: 0 0 0 1px #ddd
  border-radius: 5px
  padding: 1rem
</style>
