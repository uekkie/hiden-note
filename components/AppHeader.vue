<template lang="pug">
  div
    b-navbar
      b-navbar-brand(to="/") 秘伝のタレ

      b-navbar-toggle(target="nav-collapse")

      b-collapse#nav-collapse(is-nav)
        b-navbar-nav(v-if="userSignedIn")
          b-nav-item {{ displayName }}
          b-nav-item(@click="logout") ログアウト
          b-nav-item(to="/notes/new" exact exact-active-class="active") 新規ノート作成
        b-navbar-nav(v-else)
          b-nav-item(@click="login") ログイン
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { authStore } from '../store' // モジュールクラスをインポート

@Component
class AppHeader extends Vue {
  get userSignedIn() {
    return authStore.userSignedIn
  }

  get displayName() {
    return authStore.userDisplayName
  }

  login() {
    authStore.login()
  }

  logout() {
    if (authStore.logout()) {
      this.$router.push('/')
    }
  }
}
export default AppHeader
</script>
