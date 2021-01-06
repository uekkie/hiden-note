<template>
  <div class="popular-tags-container">
    <tag-list :tags="tags" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { notesStore } from '@/store'
import { Tag } from '@/models/tag'

@Component
class PopularTagsContainer extends Vue {
  get tags() {
    return notesStore.tags.sort((tagA: Tag, tagB: Tag) =>
      tagA.noteCount > tagB.noteCount ? -1 : 0
    )
  }

  async created() {
    await notesStore.watchTags()
  }
}
export default PopularTagsContainer
</script>
