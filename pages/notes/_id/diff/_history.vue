<template>
  <b-container>
    <h1 class="text-center">ノート更新履歴</h1>
    <b-card>
      <h5 class="text-muted">タイトル</h5>
      <div v-for="(part, index) in diffTitle" :key="index">
        <div :class="{ added: part.added, removed: part.removed }">
          <div style="white-space: pre-line">{{ part.value }}</div>
        </div>
      </div>
      <h5 class="text-muted">内容</h5>
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
import { Note, NoteHistory } from '@/models'
const Diff = require('diff')

@Component
class NoteDiff extends Vue {
  private note: Note = new Note({})
  private history: NoteHistory = new NoteHistory({})

  get diffTitle() {
    return Diff.diffLines(this.history?.title, this.note?.title)
  }

  get diffContent() {
    return Diff.diffLines(this.history?.content, this.note?.content)
  }

  async created() {
    const noteId = this.$route.params.id
    const historyId = this.$route.params.history
    this.note = await notesStore.getNote(noteId)
    this.history = await notesStore.getNoteHistory({
      id: noteId,
      historyId,
    })
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
