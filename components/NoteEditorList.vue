<template>
  <div class="histories">
    <h3>更新した人たち</h3>
    <b-list-group-item v-for="(history, index) in noteHistories" :key="index">
      <nuxt-link :to="`${noteId}/diff/${history.id}`">
        {{ history.createdAtString() }}に{{ history.creatorName() }}が更新
      </nuxt-link>
    </b-list-group-item>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { DateTime } from 'luxon'
import { notesStore } from '@/store'
import { NoteHistory } from '@/models/note'

@Component
class NoteEditorList extends Vue {
  noteHistories: NoteHistory[] = []

  @Prop({ default: false })
  noteId!: string

  created() {
    notesStore.getNote(this.noteId).then((note) => {
      notesStore.getNoteHistories(note.id).then((histories) => {
        this.noteHistories = histories
      })
    })
  }

  formatDate(date: Date): string {
    return DateTime.fromJSDate(date).toISODate()
  }
}
export default NoteEditorList
</script>
