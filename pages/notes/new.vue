<template>
  <b-container>
    <h1>新規ノート</h1>
    <b-row>
      <b-col>
        <h3>タイトル</h3>
        <b-form-input
          v-model="title"
          required
          placeholder="タイトルをいれてね"
        ></b-form-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h3>内容</h3>
        <b-form-textarea
          v-model="content"
          placeholder="markdownでかけるよ"
          rows="30"
          no-resize
          required
        ></b-form-textarea>
      </b-col>
      <b-col>
        <h3>プレビュー</h3>
        <div v-html="$sanitize(formatted_content)"></div>
      </b-col>
    </b-row>
    <b-button variant="primary" @click="saveNote">保存</b-button>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import sanitizeHTML from 'sanitize-html'
import firebase from '@/plugins/firebase'
import { mapGetters } from 'vuex'
const md = require('markdown-it')()

Vue.prototype.$sanitize = sanitizeHTML

export default Vue.extend({
  data() {
    return {
      title: '',
      content: '',
    }
  },
  computed: {
    formatted_content(): string {
      return md.render(this.content)
    },
    ...mapGetters(['notes']),
  },
  created() {},
  methods: {
    saveNote() {
      const note = {
        userId: this.$store.getters.userUid,
        title: this.title,
        content: this.content,
      }
      firebase.firestore().collection('notes').add(note)
    },
  },
})
</script>
<style></style>
