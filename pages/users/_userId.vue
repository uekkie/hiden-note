<template>
  <b-container v-if="user" style="max-width: 720px">
    <h1 class="text-center">{{ user.displayName }}</h1>
    <div class="note-list">
      <div
        v-for="note in usersNotes"
        :key="note.id"
        class="note-list__note flex-column align-items-start mb-3"
      >
        <note-list-item :note="note" :user="user(note.userId)" />
      </div>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { User, Note } from '@/models'
import { usersStore, notesStore } from '@/store'

@Component
class UserShow extends Vue {
  currentUser: User | undefined = undefined
  usersNotes: Note[] = []
  get users() {
    return usersStore.users
  }

  userId() {
    return this.$route.params.userId
  }

  async created() {
    usersStore.initialize()
    notesStore.initialize()

    const userId = this.userId()
    this.currentUser = usersStore.getUserById(userId)
    this.usersNotes = await notesStore.getNotesByUserId(userId)
  }

  user(userId: string) {
    return this.users.find((user) => user.id === userId)
  }

  get id() {
    return this.$route.params.id
  }
}
export default UserShow
</script>
