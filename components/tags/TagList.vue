<template>
  <div class="tags d-flex justify-content-start">
    <b-button
      v-for="(tag, index) in tags"
      :key="index"
      :to="`/tags/${tag.tagName}`"
      variant="primary"
      class="mx-1"
    >
      <span>{{ tag.tagName }}</span>
      <span v-if="isNoteCount">（{{ tag.noteCount }}）</span>
    </b-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
@Component
class TagList extends Vue {
  @Prop({ default: false })
  isNoteCount!: false

  @Prop({ default: {} })
  tags!: { tagName: string; noteCount: number }[]
}
export default TagList
</script>
