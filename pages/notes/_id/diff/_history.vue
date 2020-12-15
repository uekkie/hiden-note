<template>
  <b-container>
    <h1 class="text-center">ノート更新履歴</h1>
    <div class="mb-3">
      <div v-if="editor" class="d-flex justify-content-start">
        <div class="history__avatar-cell">
          <b-img v-bind="editor.photoProps" rounded="circle" />
        </div>
        <div>
          <NuxtLink :to="{ path: `/users/${editor.id}` }">
            {{ editor.name }}
          </NuxtLink>
          <br />
          {{ history.createdAtString() }}
        </div>
      </div>
    </div>
    <b-card header="タイトルの変更" class="mb-3">
      <div v-for="(part, index) in diffTitle" :key="index">
        <div :class="{ added: part.added, removed: part.removed }">
          <div style="white-space: pre-line">{{ part.value }}</div>
        </div>
      </div>
    </b-card>
    <b-card header="内容の変更">
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
import { notesStore, usersStore } from '@/store'
import { Note, NoteHistory, User } from '@/models'
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

  get editor(): User | undefined {
    return usersStore.users.find((user) => user.id === this.history.userId)
  }

  async created() {
    await usersStore.initialize()

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
.history__avatar-cell {
  width: 48px;
  width: 48px;
  padding: 8px;
  vertical-align: center;
}
</style>
