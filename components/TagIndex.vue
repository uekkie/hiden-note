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
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { Tag } from '@/models/tag'

export default defineComponent({
  props: {
    tags: {
      type: Array as PropType<Tag[]>,
    },
  },
})
</script>
<style lang="sass" scoped>
.tags__container
  width: 100%
  min-width: 320px
</style>
