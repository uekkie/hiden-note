<template>
  <b-container v-if="!loading">
    <h1>編集</h1>
    <b-row>
      <b-col>
        <h3>タイトル</h3>
        <b-form-input
          v-model.trim="note.title"
          required
          placeholder="タイトルをいれてね"
        ></b-form-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h3>内容</h3>
        <b-form-textarea
          v-model.trim="note.content"
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
    <b-button variant="primary" :disabled="!canSubmit" @click="onUpdate"
      >保存</b-button
    >
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'

import sanitizeHTML from 'sanitize-html'
import { mapGetters, mapActions } from 'vuex'
const md = require('markdown-it')()

export default Vue.extend({
  computed: {
    loading(): boolean {
      return !this.note
    },
    formatted_content(): string {
      return sanitizeHTML(md.render(this.note.content))
    },
    canSubmit(): boolean {
      return this.note.title.length > 0 && this.note.content.length > 0
    },
    ...mapGetters('notes', ['note']),
  },
  created() {
    this.fetchNote(this.$route.params.id)
  },
  methods: {
    ...mapActions('notes', ['fetchNote', 'updateNote']),
    onUpdate() {
      const noteId = this.$route.params.id
      this.updateNote({
        noteId,
        note: this.note,
      }).then(() => {
        this.$router.replace({ path: '/notes/' + noteId })
      })
    },
  },
})
</script>
<style></style>
