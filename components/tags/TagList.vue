<template>
  <div>
    <div
      v-for="(tag, index) in tags"
      :key="index"
      class="tag-list__tag-list-item"
    >
      <nuxt-link
        :to="`/tags/${tag.tagName}`"
        class="tag-list__tag-list-item--link"
      >
        <span>
          {{ tag.tagName }}
          <b-badge v-if="isNoteCount" variant="success">
            {{ tag.noteCount }}
          </b-badge>
        </span>
      </nuxt-link>
    </div>
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
<style lang="sass">
@import '@/assets/stylesheets/_resources.sass'
.tag-list__tag-list-item--link
  text-overflow: ellipsis
  border-radius: 5px
  display: block
  padding-top: 8px
  padding-left: 20px
  height: 40px
  color: black
  &:hover
    text-decoration: none
    cursor: pointer
    color: $brand-color
    background-color: #ddd
</style>
