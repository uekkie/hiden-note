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
import { mapGetters, mapActions } from 'vuex'
import { Note } from '@/models/note'
const md = require('markdown-it')()

export default Vue.extend({
  data() {
    return {
      title: '',
      content: '',
    }
  },
  computed: {
    formatted_content(): string {
      return sanitizeHTML(md.render(this.content))
    },
    canSubmit(): boolean {
      return this.title.length > 0 && this.content.length > 0
    },
    ...mapGetters(['notes']),
    ...mapGetters('users', ['currentUserRef']),
  },
  methods: {
    ...mapActions('notes', ['createNote']),
    saveNote() {
      this.createNote(
        new Note(this.currentUserRef, this.title, this.content)
      ).then((noteId) => {
        this.$router.replace({ path: '/notes/' + noteId })
      })
    },
  },
})
</script>
<style></style>
