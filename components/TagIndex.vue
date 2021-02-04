<template>
  <div class="tags__container">
    <tag-list-item
      v-for="(tag, index) in tags"
      :key="index"
      :tag="tag"
      :is-note-count="true"
    />
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  useAsync,
  inject,
  onMounted,
} from '@nuxtjs/composition-api'
import { TagStore } from '@/composables/use-tag'
import TagKey from '@/composables/use-tag-key'

export default defineComponent({
  props: {},

  setup() {
    onMounted(() => {
      const { fetchTags } = inject(TagKey) as TagStore
      useAsync(() => fetchTags())
    })
    const { tags } = inject(TagKey) as TagStore
    return {
      tags,
    }
  },
})
</script>
<style lang="sass" scoped>
.tags__container
  width: 100%
</style>
