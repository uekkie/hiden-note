<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="formattedContent"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

const md = require('markdown-it')().use(require('markdown-it-highlightjs'), {
  inline: true,
  html: false,
  linkify: true,
  breaks: true,
})

@Component
class MarkdownPreview extends Vue {
  @Prop({ default: false })
  content!: string

  get formattedContent(): string {
    return md.render(this.content)
  }
}
export default MarkdownPreview
</script>
