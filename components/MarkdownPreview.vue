<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="formatted_content"></div>
</template>

<script lang="ts">
import Vue from 'vue'

import sanitizeHTML from 'sanitize-html'
const md = require('markdown-it')({
  html: false,
  linkify: true,
  breaks: true,
})
export default Vue.extend({
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    formatted_content(): string {
      return sanitizeHTML(md.render(this.content))
    },
  },
})
</script>
