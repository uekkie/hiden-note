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
  tags: Tag[] = []

  async created() {
    this.tags = await notesStore.fetchTags({ limit: 5 })
  }
}
export default PopularTagsContainer
</script>
