<template>
  <b-container>
    <h1 class="title">秘伝のタレ</h1>
    <note-list v-if="userSignedIn"></note-list>
    <div v-else>ログインしてください</div>
  </b-container>
</template>

<script lang="ts">
import { authStore } from '@/store'
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
class Index extends Vue {
  get userSignedIn() {
    return authStore.userSignedIn
  }
}
export default Index
</script>

<style>
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
</style>
