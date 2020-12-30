<template>
  <div class="popular-tags-container">
    <tag-list :tags="tagInfos" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { notesStore } from '@/store'

@Component
class PopularTagsContainer extends Vue {
  tagInfos: { tagName: string; noteCount: number }[] = []

  async created() {
    const tags = await notesStore.fetchTags({ limit: 5 })
    tags.forEach((tag) => {
      this.tagInfos.push({
        tagName: tag,
        noteCount: 1, // await notesStore.getNotesCountByTagName(tag),
      })
    })
  }
}
export default PopularTagsContainer
</script>
