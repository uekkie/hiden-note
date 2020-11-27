<template lang="pug">
  .notes
    h3 ノート一覧
    p ノート総数：{{ notes.length }}

    b-list-group
      b-list-group-item(variant="primary"
        class="flex-column align-items-start")
        b-row
          b-col タイトル
          b-col 更新日

      b-list-group-item(v-for="(note, index) in notes"
        :key="index"
        class="flex-column align-items-start")
        b-row
          b-col
            nuxt-link(:to="`/notes/${note.id}`") {{ note.title }}

          b-col
            //- small {{ note.userName }}
            small {{ formatDate(note.updatedAt.toDate()) }}
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { DateTime } from 'luxon'
import { notesStore } from '@/store'
import { Note } from '@/models'

@Component
class NoteList extends Vue {
  get notes() {
    return notesStore.notes.sort((noteA: Note, noteB: Note) =>
      noteA.updatedAt > noteB.updatedAt ? -1 : 0
    )
  }

  formatDate(date: Date): string {
    return DateTime.fromJSDate(date).toISODate()
  }
}
export default NoteList
</script>
