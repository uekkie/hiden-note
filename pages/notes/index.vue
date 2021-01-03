<template>
  <b-container class="container-fluid">
    <div class="notes__columns">
      <div class="notes__left-column mr-3">
        <div v-if="userSignedIn" class="notes__tag-index">
          <popular-tags-container />
        </div>
      </div>
      <div class="notes__right-column">
        <div v-if="userSignedIn">
          <notes-container :notes="recentNotes" />
        </div>
        <div v-else>ログインしてください</div>
      </div>
    </div>
  </b-container>
</template>

<script lang="ts">
import { authStore, notesStore, usersStore } from '@/store'
import { Component, Vue } from 'nuxt-property-decorator'
import 'highlight.js/styles/atom-one-light.css'
import { db } from '@/plugins/firebase'

@Component({})
class Index extends Vue {
  get userSignedIn() {
    return authStore.userSignedIn
  }

  get recentNotes() {
    return notesStore.recentNotes
  }

  async created() {
    await notesStore.initialize()
    await usersStore.initialize()

    const querySnapshot = await db
      .collection('notes')
      .where(`tags.dfaffdasf`, '==', true)
      .get()
    console.log(querySnapshot.empty)
  }
}
export default Index
</script>

<style lang="sass">
@import '@/assets/stylesheets/_resources.sass'
.notes__columns
  display: flex
  height: calc(100vh - #{$header-height})

.notes__left-column
  min-width: 180px
  height: 100%
  overflow-y: auto

.notes__right-column
  height: 100%
</style>
