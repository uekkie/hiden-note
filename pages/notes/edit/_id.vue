<template>
  <b-container>
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
    <b-button variant="primary" :disabled="!canSubmit" @click="updateNote"
      >保存</b-button
    >
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Note } from '@/models/note'
import sanitizeHTML from 'sanitize-html'
import { firebase, db } from '@/plugins/firebase'
import { mapGetters } from 'vuex'
const md = require('markdown-it')()

export default Vue.extend({
  data() {
    return {
      note: {
        id: '',
        title: '',
        content: '',
      } as Note,
    }
  },
  computed: {
    formatted_content(): string {
      return sanitizeHTML(md.render(this.note.content))
    },
    canSubmit(): boolean {
      return this.note.title.length > 0 && this.note.content.length > 0
    },
    ...mapGetters(['notes']),
  },
  created() {
    const vue = this
    db.collection('notes')
      .doc(this.$route.params.id)
      .get()
      .then(function (snapshot) {
        vue.note.id = snapshot.id
        vue.note.userId = snapshot.get('userId')
        vue.note.title = snapshot.get('title')
        vue.note.content = snapshot.get('content')
      })
  },
  methods: {
    updateNote() {
      const vue = this
      db.collection('notes')
        .doc(this.note.id)
        .update({
          title: vue.note.title,
          content: vue.note.content,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(function () {
          vue.$router.push('/notes/' + vue.note.id)
        })
    },
  },
})
</script>
<style></style>
