<template>
  <b-container v-if="user" style="max-width: 720px">
    <h1 class="text-center">{{ user.displayName }}</h1>
    <h5>作成したノート: {{ usersNotes ? usersNotes.length : '' }}</h5>
    <b-list-group>
      <b-list-group-item v-for="note in usersNotes" :key="note.id">
        <NuxtLink :to="{ name: 'notes-id', params: { id: note.id } }">
          <h5>{{ note.title }}</h5>
        </NuxtLink>
        <div class="text-muted">
          <div>作成日: {{ note.createdAtString() }}</div>
        </div>
      </b-list-group-item>
    </b-list-group>
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

  userId() {
    return this.$route.params.userId
  }

  get user() {
    return this.currentUser
  }

  async created() {
    usersStore.initialize()
    notesStore.initialize()

    const userId = this.userId()
    this.currentUser = usersStore.getUserById(userId)
    this.usersNotes = await notesStore.getNotesByUserId(userId)
  }

  get id() {
    return this.$route.params.id
  }
}
export default UserShow
</script>
