<template lang="pug">
  .tags.d-flex.justify-content-start
    b-button(v-for="(tag, index) in tags" :key="index" variant="primary" class="mx-1") {{ tag }}
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
@Component
class TagList extends Vue {
  @Prop({ default: false })
  tags!: string[]
}
export default TagList
</script>
