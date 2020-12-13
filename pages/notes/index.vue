<template>
  <b-container>
    <h1 class="title">秘伝のタレ</h1>
    <div class="notes__search-form my-3">
      <note-search-form />
    </div>
    <template v-if="userSignedIn">
      <div class="notes__tag-index">
        <tag-index />
      </div>
      <div class="notes__note-list my-3">
        <note-list />
      </div>
    </template>
    <div v-else>ログインしてください</div>
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
.title
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
  display: block
  font-weight: 300
  font-size: 100px
  color: #35495e
  letter-spacing: 1px
</style>
