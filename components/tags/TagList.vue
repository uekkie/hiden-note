<template lang="pug">
  .tags.d-flex.justify-content-start
    b-button(:to="`/tags/${tag.tagName}`" v-for="(tag, index) in tags" :key="index" variant="primary" class="mx-1")
      span {{ tag.tagName }}
      span(v-if="isNoteCount") （{{tag.noteCount}}）
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
