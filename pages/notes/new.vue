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
        <b-form-textarea
          v-model="formatted_content"
          placeholder="プレビューされるよ"
          rows="40"
          no-resize
          readonly
        ></b-form-textarea>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      content: '',
    }
  },
  computed: {
    formatted_content(): string {
      return this.content.toUpperCase()
    },
  },
})
</script>
<style></style>
