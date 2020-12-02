<template>
  <b-container>
    <h1 class="text-center">ノート更新履歴</h1>
    <b-card>
      <h5 class="text-muted">Content</h5>
      <div v-for="(part, index) in diffContent" :key="index">
        <div :class="{ added: part.added, removed: part.removed }">
          <div style="white-space: pre-line">{{ part.value }}</div>
        </div>
      </div>
    </b-card>
  </b-container>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { notesStore } from '@/store'
const Diff = require('diff')

@Component
class NoteDiff extends Vue {
  prevNoteContent: string = ''
  currentNoteContent: string = ''
  async created() {
    const noteId = this.$route.params.id
    const historyId = this.$route.params.history
    const note = await notesStore.getNote(noteId)
    const history = await notesStore.getNoteHistory({
      id: noteId,
      historyId,
    })

    this.prevNoteContent = history.content
    this.currentNoteContent = note.content
  }

  get diffContent() {
    console.log(Diff.diffLines(this.prevNoteContent, this.currentNoteContent))

    return Diff.diffLines(this.prevNoteContent, this.currentNoteContent)
  }
}
export default NoteDiff
</script>

<style scoped>
.added {
  background-color: #e6ffed;
}
.removed {
  background-color: #ffdce0;
}
</style>
