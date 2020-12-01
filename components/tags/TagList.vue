<template lang="pug">
  .tags.d-flex.justify-content-start
    b-button(:to="`/tags/${tag.tagName}`" v-for="(tag, index) in tags" :key="index" variant="primary" class="mx-1") {{ tag.tagName }}（{{tag.noteCount}}）
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
@Component
class TagList extends Vue {
  @Prop({ default: false })
  tags!: { tagName: string; noteCount: number }[]
}
export default TagList
</script>
