<template>
  <div class="popular-tags-container">
    <tag-list :tags="tags" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { notesStore } from '@/store'
import sortBy from 'lodash-es/sortBy'

@Component
class PopularTagsContainer extends Vue {
  get tags() {
    return sortBy(notesStore.tags, (tag) => -tag.noteCount)
  }

  async created() {
    await notesStore.watchTags()
  }
}
export default PopularTagsContainer
</script>
