<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="formattedContent"></div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

const md = require('markdown-it')().use(require('markdown-it-highlightjs'), {
  inline: true,
  html: false,
  linkify: true,
  breaks: true,
})

export default defineComponent({
  props: {
    content: {
      type: String,
      require: true,
    },
  },
  setup(props) {
    const formattedContent = computed((): string => {
      return md.render(props.content)
    })
    return {
      formattedContent,
    }
  },
})
</script>
