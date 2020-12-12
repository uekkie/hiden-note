<template>
  <div class="tag-index">
    <tag-list :tags="tagInfos" is-note-count="true"></tag-list>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { DateTime } from 'luxon'
import { notesStore } from '@/store'

@Component
class TagIndex extends Vue {
  tagInfos: { tagName: string; noteCount: number }[] = []

  async created() {
    const tags = await notesStore.fetchTags({ limit: 5 })
    await tags.forEach(async (tag) => {
      this.tagInfos.push({
        tagName: tag,
        noteCount: await notesStore.getNotesCountByTagName(tag),
      })
    })
  }

  formatDate(date: Date): string {
    return DateTime.fromJSDate(date).toISODate()
  }
}
export default TagIndex
</script>
