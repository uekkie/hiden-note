<template>
  <b-container v-if="!loading">
    <h1>{{ note.title }}</h1>
    <div class="d-flex justify-content-end">
      <div class="edit">
        <b-icon variant="secondary" icon="pencil"></b-icon>
        <b-link class="text-secondary" :to="`edit/${noteId()}`"
          >編集する</b-link
        >
      </div>
      <div class="delete">
        <b-icon variant="danger" icon="trash"></b-icon>
        <b-link class="text-danger" @click="modalShow = !modalShow"
          >削除する</b-link
        >
      </div>
    </div>
    <tag-list :tags="note.tags" />

    <markdown-preview :content="note.content" />

    <b-modal v-model="modalShow" title="ノートの削除" @ok="handleDeleteNote"
      >削除してよろしいですか？</b-modal
    >
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Note } from '@/models/note'
import { notesStore } from '@/store'
import TagList from '~/components/tags/TagList.vue'

export default Vue.extend({
  components: { TagList },
  data() {
    return {
      note: null as Note | null,
      modalShow: false,
    }
  },
  computed: {
    loading(): boolean {
      return !this.note
    },
  },
  created() {
    notesStore.getNote(this.$route.params.id).then((note) => {
      this.note = note
    })
  },
  methods: {
    noteId() {
      return this.$route.params.id
    },
    handleDeleteNote(bvModalEvt: any) {
      bvModalEvt.preventDefault()
      notesStore.deleteNote(this.$route.params.id)
      this.$router.push('/')
    },
  },
})
</script>
