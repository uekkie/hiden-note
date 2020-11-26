<template>
  <div>
    <b-navbar>
      <b-navbar-brand to="/">秘伝のタレ</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="userSignedIn">
          <b-nav-item>{{ displayName }}</b-nav-item>
          <b-nav-item @click="logout">ログアウト</b-nav-item>
          <b-nav-item to="/notes/new" exact exact-active-class="active"
            >新規ノート作成</b-nav-item
          >
        </b-navbar-nav>
        <b-navbar-nav v-else>
          <b-nav-item @click="login">ログイン</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
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
    return authStore.login()
  }

  logout() {
    return authStore.logout()
  }
}
export default AppHeader
</script>
