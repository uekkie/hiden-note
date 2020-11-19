<template>
  <b-container>
    <h1>{{ note.title }}</h1>
    <div class="content" v-html="formatted_content"></div>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { db } from '@/plugins/firebase'
export type Note = {
  id: string
  title: string
  content: string
}
const md = require('markdown-it')()
export default Vue.extend({
  data() {
    return {
      note: {
        title: '',
        content: '',
      } as Note,
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
        vue.note.title = snapshot.get('title')
        vue.note.content = snapshot.get('content')
      })
  },
})
</script>

<style></style>
