<template>
  <div class="notes">
    <h3>ノート一覧</h3>
    <p>ノート総数：{{ notes.length }}</p>
    <b-list-group>
      <b-list-group-item
        v-for="note in notes"
        :key="note.id"
        :to="`/notes/${note.id}`"
        class="flex-column align-items-start"
      >
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">{{ note.title }}</h5>
          <small>3 days ago</small>

          <p class="mb-1">
            {{ note.content }}
          </p>
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapGetters(['notes']),
  },
  created() {
    console.log('notelist created!')
    this.fetchNotes()
  },
  methods: {
    ...mapMutations(['fetchNotes']),
  },
})
</script>
<style></style>
