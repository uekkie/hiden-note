<template>
  <div class="tag-list-item">
    <b-button
      :to="`/tags/${tag.content}`"
      variant="primary"
      class="tag-list-item__button btn-sm mr-1 my-2"
    >
      <span>
        {{ tag.content }}
        <b-badge v-if="isNoteCount" variant="light">
          {{ tag.noteCount }}
        </b-badge>
      </span>
    </b-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { Tag } from '@/models/tag'

export default defineComponent({
  props: {
    isNoteCount: {
      // プロパティ名
      type: Boolean, // 型
      required: true, // 必須かどうか
    },
    tag: {
      type: Object as PropType<Tag>,
      required: true,
    },
  },
  setup() {
    return {}
  },
})
</script>
<style lang="sass" scoped>
.tag-list-item
  display: inline-block
</style>
