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

  setup(props) {
    console.log(props.tags)

    // onMounted(() => {
    //   const { fetchTags } = inject(TagKey) as TagStore
    //   useAsync(() => fetchTags())
    // })
    // const { tags } = inject(TagKey) as TagStore
    // const tags = props.tags
    return {
      // tags,
    }
  },
})
</script>
<style lang="sass" scoped>
.tags__container
  width: 100%
</style>
