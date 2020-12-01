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
          <b-col>タイトル</b-col>
          <b-col>作成者</b-col>
          <b-col>更新日</b-col>
        </b-row>
      </b-list-group-item>
      <b-list-group-item
        v-for="(note, index) in notes"
        :key="index"
        class="flex-column align-items-start"
      >
        <b-row>
          <b-col>
            <nuxt-link :to="`/notes/${note.id}`">{{ note.title }}</nuxt-link>
          </b-col>
          <b-col>
            <span>
              <NuxtLink :to="`/users/${note.userId}`">{{
                userName(note.userId)
              }}</NuxtLink>
            </span>
          </b-col>
          <b-col>
            <small>{{ formatDate(note.updatedAt.toDate()) }}</small>
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { DateTime } from 'luxon'
import { notesStore, usersStore } from '@/store'

@Component
class NoteList extends Vue {
  get notes() {
    return notesStore.recentNotes
  }

  get users() {
    return usersStore.users
  }

  userName(userId: string) {
    return this.users.find((user) => user.id === userId)?.displayName
  }

  formatDate(date: Date): string {
    return DateTime.fromJSDate(date).toISODate()
  }
}
export default NoteList
</script>
