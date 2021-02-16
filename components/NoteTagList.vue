<template template>
  <div class="d-flex justify-content-start flex-wrap">
    <b-button
      v-for="(tag, index) in tags"
      :key="index"
      :to="`/tags/${tag}`"
      variant="primary"
      class="tag__tag-button btn-sm mr-1 my-2"
    >
      <span>
        {{ tag }}
      </span>
    </b-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { Tag } from '@/models/tag'

export default defineComponent({
  props: {
    tags: Array as PropType<Tag[]>,
  },
})
</script>
<style lang="sass"></style>
