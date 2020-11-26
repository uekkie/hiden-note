<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="formattedContent"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

import sanitizeHTML from 'sanitize-html'
const md = require('markdown-it')({
  html: false,
  linkify: true,
  breaks: true,
})

@Component
class MarkdownPreview extends Vue {
  @Prop({ default: false })
  content!: string

  get formattedContent(): string {
    return sanitizeHTML(md.render(this.content))
  }
}
export default MarkdownPreview
</script>
