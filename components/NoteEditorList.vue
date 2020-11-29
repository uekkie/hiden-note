<template>
  <div class="histories">
    <h3>更新した人たち</h3>
    <b-list-group-item v-for="(history, index) in noteHistories" :key="index">
      <b-row>
        <b-col cols="3">
          <b-img
            v-bind="userIconProps(history.userId)"
            rounded="circle"
          ></b-img>
        </b-col>
        <b-col
          ><nuxt-link :to="`${noteId}/diff/${history.id}`">
            {{ getUserName(history.userId) }}
          </nuxt-link>
          <br />
          {{ history.createdAtString() }}
        </b-col>
      </b-row>
    </b-list-group-item>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { DateTime } from 'luxon'
import { notesStore, usersStore } from '@/store'
import { User } from '@/models'
import { NoteHistory } from '@/models/note'

@Component
class NoteEditorList extends Vue {
  noteHistories: NoteHistory[] = []
  users: User[] = []

  @Prop({ default: false })
  noteId!: string

  async created() {
    await notesStore.initialize()
    await usersStore.initialize()

    notesStore.getNote(this.noteId).then((note) => {
      notesStore.getNoteHistories(note.id).then((histories) => {
        this.noteHistories = histories
          .sort((value1: NoteHistory, value2: NoteHistory) =>
            value1.createdAt > value2.createdAt ? -1 : 0
          )
          .slice(0, 5)
      })
    })
    this.users = usersStore.users
  }

  userIconProps(userId: string) {
    return {
      width: 32,
      height: 32,
      class: 'm1',
      src: this.getUser(userId)?.photoURL,
    }
  }

  getUser(userId: string): User | null {
    const matchUsers = this.users.filter((user) => {
      return user.id === userId
    })

    return matchUsers.length === 0 ? null : matchUsers[0]
  }

  getUserName(userId: string): string {
    const user = this.getUser(userId)
    return user ? user.displayName : '不明'
  }

  formatDate(date: Date): string {
    return DateTime.fromJSDate(date).toISODate()
  }
}
export default NoteEditorList
</script>
