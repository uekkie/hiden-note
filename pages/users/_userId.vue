<template>
  <b-container v-if="currentUser">
    <h1 class="text-center">{{ currentUser.displayName }}</h1>
    <notes-container :notes="usersNotes" />
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { usersStore, notesStore } from '@/store'

@Component
class UserShow extends Vue {
  get users() {
    return usersStore.users
  }

  get currentUser() {
    const uid = this.userId()
    return this.users.find((user) => user.id === uid)
  }

  userId() {
    return this.$route.params.userId
  }

  get usersNotes() {
    return notesStore.usersNotes
  }

  async created() {
    await usersStore.initialize()
    await notesStore.initialize()

    const userId = this.userId()
    await notesStore.storeUsersNotes(userId)
  }
}
export default UserShow
</script>
