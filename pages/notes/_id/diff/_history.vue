<template lang="pug">
  b-container
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { notesStore } from '@/store'
const { Diff } = require('diff')

@Component
class NoteDiff extends Vue {
  async mounted() {
    const noteId = this.$route.params.id
    const historyId = this.$route.params.history
    const note = await notesStore.getNote(noteId)
    const history = await notesStore.getNoteHistory({
      id: noteId,
      historyId,
    })

    const oldNoteContent = history.content
    const newNoteContent = note.content
    const fragment = this.renderDiff(oldNoteContent, newNoteContent)

    this.$el.appendChild(fragment)
  }

  renderDiff(oldString: string, newString: string) {
    const diff = new Diff()

    const changes = diff.diff(oldString, newString)

    const fragment = document.createDocumentFragment()

    let span = null
    changes.forEach((part: any) => {
      const color = part.added ? 'green' : part.removed ? 'red' : 'grey'
      span = document.createElement('span')
      span.style.color = color
      span.appendChild(document.createTextNode(part.value))
      fragment.appendChild(span)
    })

    return fragment
  }
}
export default NoteDiff
</script>
