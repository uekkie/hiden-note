<template>
  <b-container>
    <h1>{{ note.title }}</h1>
    <div class="content" v-html="formatted_content"></div>

    <b-button :to="`edit/${note.id}`" variant="primary">編集</b-button>
    <b-button variant="danger" @click="modalShow = !modalShow">削除</b-button>

    <b-modal v-model="modalShow" title="ノートの削除" @ok="handleDeleteNote"
      >削除してよろしいですか？</b-modal
    >
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { db } from '@/plugins/firebase'
import { Note } from '@/models/note'

const md = require('markdown-it')()
export default Vue.extend({
  data() {
    return {
      note: {
        id: '',
        title: '',
        content: '',
      } as Note,
      modalShow: false,
    }
  },
  computed: {
    formatted_content(): string {
      return md.render(this.note.content)
    },
  },
  created() {
    const vue = this
    db.collection('notes')
      .doc(this.$route.params.id)
      .get()
      .then(function (snapshot) {
        vue.note.id = snapshot.id
        vue.note.title = snapshot.get('title')
        vue.note.content = snapshot.get('content')
      })
  },
  methods: {
    handleDeleteNote(bvModalEvt: any) {
      bvModalEvt.preventDefault()
      const vue = this

      db.collection('notes')
        .doc(this.$route.params.id)
        .delete()
        .then(function () {
          console.log('Note successfully deleted!')
          vue.$router.push('/')
        })
        .catch(function (error) {
          console.error('Error removing note: ', error)
        })
    },
  },
})
</script>

<style></style>
