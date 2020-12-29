<template>
  <b-container class="container-fluid">
    <div class="notes__columns">
      <div class="notes__left-column">
        <div v-if="userSignedIn" class="notes__tag-index">
          <tag-index />
        </div>
      </div>
      <div class="notes__right-column">
        <div v-if="userSignedIn" class="notes__note-list my-3">
          <note-list />
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

@Component({})
class Index extends Vue {
  get userSignedIn() {
    return authStore.userSignedIn
  }

  async created() {
    await notesStore.initialize()
    await usersStore.initialize()
  }
}
export default Index
</script>

<style lang="sass">
@import '@/assets/stylesheets/_resources.sass'
.title
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
  display: block
  font-weight: 300
  font-size: 100px
  color: #35495e
  letter-spacing: 1px

.notes__columns
  display: flex
  height: calc(100vh - #{$header-height})

.notes__left-column
  width: 350px
  height: 100%
  overflow-y: auto

.notes__right-column
  height: 100%
</style>
