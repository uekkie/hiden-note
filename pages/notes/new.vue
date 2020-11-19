<template>
  <b-container>
    <h1>新規ノート</h1>
    <b-row>
      <b-col>
        <h3>タイトル</h3>
        <b-form-input
          v-model.trim="title"
          required
          placeholder="タイトルをいれてね"
        ></b-form-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h3>内容</h3>
        <b-form-textarea
          v-model.trim="content"
          placeholder="markdownでかけるよ"
          rows="30"
          no-resize
          required
        ></b-form-textarea>
      </b-col>
      <b-col>
        <h3>プレビュー</h3>
        <div v-html="formatted_content"></div>
      </b-col>
    </b-row>
    <b-button variant="primary" :disabled="!canSubmit" @click="saveNote"
      >保存</b-button
    >
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import sanitizeHTML from 'sanitize-html'
import { db } from '@/plugins/firebase'
import { mapGetters } from 'vuex'
const md = require('markdown-it')()

export default Vue.extend({
  data() {
    return {
      title: '' as string,
      content: '' as string,
    }
  },
  computed: {
    formatted_content(): string {
      return sanitizeHTML(md.render(this.content))
    },
    canSubmit() {
      return this.title.length > 0 && this.content.length > 0
    },
    ...mapGetters(['notes']),
  },
  methods: {
    saveNote() {
      const note = {
        userId: this.$store.getters.userUid,
        title: this.title,
        content: this.content,
      }
      db.collection('notes').add(note)
    },
  },
})
</script>
<style></style>
