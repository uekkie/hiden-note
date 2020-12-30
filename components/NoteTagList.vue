<template>
  <div class="d-flex justify-content-start flex-wrap">
    <b-button
      v-for="(tag, index) in tags"
      :key="index"
      :to="`/tags/${tag.tagName}`"
      variant="primary"
      class="tag__tag-button btn-sm mr-1 my-2"
    >
      <span>
        {{ tag.tagName }}
      </span>
    </b-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
@Component
class NoteTagList extends Vue {
  @Prop({ default: false })
  isNoteCount!: false

  @Prop({ default: {} })
  tags!: { tagName: string; noteCount: number }[]
}
export default NoteTagList
</script>
<style lang="sass"></style>
