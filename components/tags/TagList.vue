<template>
  <div class="tags d-flex justify-content-start">
    <b-button v-for="(tag, index) in tags" :key="index" variant="primary">
      {{ tag }}
    </b-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    tags: {
      type: String,
      required: true,
    },
  },
})
</script>
