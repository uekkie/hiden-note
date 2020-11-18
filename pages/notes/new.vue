<template>
  <b-container>
    <h1>新規ノート</h1>
    <b-row>
      <b-col>
        <h3>内容</h3>
        <b-form-textarea
          v-model="content"
          placeholder="markdownでかけるよ"
          rows="40"
          no-resize
        ></b-form-textarea>
      </b-col>
      <b-col>
        <h3>プレビュー</h3>
        <div v-html="formatted_content"></div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
const md = require('markdown-it')()

export default Vue.extend({
  data() {
    return {
      content: '',
    }
  },
  computed: {
    formatted_content(): string {
      return md.render(this.content)
    },
  },
})
</script>
<style></style>
