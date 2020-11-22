<template>
  <b-container v-if="!loading">
    <h1>{{ note.title }}</h1>
    <div class="content" v-html="formatted_content"></div>

    <b-button :to="`edit/${noteId()}`" variant="primary">編集</b-button>
    <b-button variant="danger" @click="modalShow = !modalShow">削除</b-button>

    <b-modal v-model="modalShow" title="ノートの削除" @ok="handleDeleteNote"
      >削除してよろしいですか？</b-modal
    >
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'

const md = require('markdown-it')()

export default Vue.extend({
  data() {
    return {
      modalShow: false,
    }
  },
  computed: {
    ...mapGetters('notes', ['note']),

    loading(): boolean {
      return !this.note
    },
    formatted_content(): string {
      return md.render(this.note.content)
    },
  },
  created() {
    this.fetchNote(this.$route.params.id)
  },
  methods: {
    ...mapActions('notes', ['fetchNote', 'deleteNote']),
    noteId() {
      return this.$route.params.id
    },
    handleDeleteNote(bvModalEvt: any) {
      bvModalEvt.preventDefault()
      this.deleteNote(this.$route.params.id)
      this.$router.push('/')
    },
  },
})
</script>

<style></style>
