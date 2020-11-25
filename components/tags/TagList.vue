<template>
  <div class="tags d-flex justify-content-start">
    <b-button
      v-for="(tag, index) in tags"
      :key="index"
      variant="primary"
      class="mx-1"
    >
      {{ tag }}
    </b-button>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
export default Vue.extend({
  props: {
    tags: {
      type: Array as PropType<string[]>,
      default: [],
    },
  },
})
</script>
