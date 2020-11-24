<template>
  <b-container>
    <b-row align-v="start">
      <b-col>
        <b-form-input
          v-model.trim="title"
          required
          placeholder="タイトルをいれてね"
        ></b-form-input>
      </b-col>
    </b-row>

    <b-row align-v="stretch">
      <b-col class="pr-0">
        <b-form-textarea
          v-model.trim="content"
          placeholder="markdownでかけるよ"
          rows="30"
          required
        ></b-form-textarea>
      </b-col>
      <b-col class="pl-0">
        <div class="px-2 py-1 border h-100" v-html="formatted_content"></div>
      </b-col>
    </b-row>

    <b-row align-v="end">
      <b-col>
        <b-button
          variant="success float-right mt-2"
          :disabled="!canSubmit"
          @click="saveNote"
          >保存</b-button
        >
      </b-col>
    </b-row>
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
