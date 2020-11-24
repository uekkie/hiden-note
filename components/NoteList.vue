<template>
  <div class="notes">
    <h3>ノート一覧</h3>
    <p>ノート総数：{{ notes.length }}</p>

    <b-list-group>
      <b-list-group-item
        variant="primary"
        class="flex-column align-items-start"
      >
        <b-row>
          <b-col> タイトル </b-col>
          <b-col> 更新日 </b-col>
        </b-row>
      </b-list-group-item>
      <b-list-group-item
        v-for="(note, index) in notes"
        :key="index"
        class="flex-column align-items-start"
      >
        <b-row>
          <b-col>
            <nuxt-link :to="`/notes/${note.noteId}`">{{
              note.title
            }}</nuxt-link>
          </b-col>
          <b-col>
            <small>{{ formatDate(note.createdAt.toDate()) }}</small>
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { DateTime } from 'luxon'
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
    formatDate(date: Date): string {
      return DateTime.fromJSDate(date).toISODate()
    },
  },
})
</script>
<style></style>
