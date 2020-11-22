<template>
  <div class="notes">
    <h3>ノート一覧</h3>
    <p>ノート総数：{{ notes.length }}</p>
    <b-list-group>
      <b-list-group-item
        v-for="(note, index) in notes"
        :key="index"
        :to="`/notes/${note.noteId}`"
        class="flex-column align-items-start"
      >
        <b-row>
          <b-col
            ><h5 class="mb-1">{{ note.title }}</h5></b-col
          >
          <b-col>
            <small>{{ note.createdAt }}</small>
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapGetters('notes', ['notes']),
  },
  created() {
    this.fetchNotes()
  },
  methods: {
    ...mapActions('notes', ['fetchNotes']),
  },
})
</script>
<style></style>
