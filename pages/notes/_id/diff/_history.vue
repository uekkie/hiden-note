<template>
  <b-container>
    <h1 class="text-center">ノート更新履歴</h1>

    <template v-if="state.isLoading">読込中...</template>
    <template v-else>
      <b-card>
        <h5 class="text-muted">Content</h5>
        <div v-for="(part, index) in diffContent" :key="index">
          <div :class="{ added: part.added, removed: part.removed }">
            <div style="white-space: pre-line">{{ part.value }}</div>
          </div>
        </div>
      </b-card>
    </template>
  </b-container>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  inject,
  useAsync,
  computed,
} from '@nuxtjs/composition-api'

import NoteKey from '~/composables/use-note-key'
import { NoteStore } from '~/composables/use-note'
const Diff = require('diff')

export default defineComponent({
  setup(_props, ctx) {
    const state = reactive({
      prevNoteContent: '',
      currentNoteContent: '',
      isLoading: true,
    })

    const diffContent = computed(() => {
      return Diff.diffLines(state.prevNoteContent, state.currentNoteContent)
    })
    const { getNote, getNoteHistory } = inject(NoteKey) as NoteStore

    useAsync(async () => {
      const noteId = ctx.root.$route.params.id
      const historyId = ctx.root.$route.params.history
      const note = await getNote(noteId)
      const history = await getNoteHistory({ id: noteId, historyId })
      state.prevNoteContent = history.content
      state.currentNoteContent = note.content
      state.isLoading = false
    })
    return {
      state,
      diffContent,
    }
  },
})
</script>

<style scoped>
.added {
  background-color: #e6ffed;
}
.removed {
  background-color: #ffdce0;
}
</style>
