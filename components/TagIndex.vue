<template lang="pug">
  .tag-index
    tag-list(:tags='tags')
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { DateTime } from 'luxon'
import { notesStore } from '@/store'

@Component
class TagIndex extends Vue {
  tags: string[] = []

  async created() {
    this.tags = await notesStore.fetchTags({ limit: 5 })
  }

  formatDate(date: Date): string {
    return DateTime.fromJSDate(date).toISODate()
  }
}
export default TagIndex
</script>
