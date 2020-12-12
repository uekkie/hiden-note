<template>
  <div>
    <b-navbar>
      <b-navbar-brand to="/">秘伝のタレ</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="userSignedIn">
          <b-nav-item>
            <b-img v-bind="photoProps" rounded="circle"></b-img>
            <nuxt-link :to="{ path: `/users/${userId}` }">{{
              displayName
            }}</nuxt-link>
          </b-nav-item>
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
import { authStore } from '../store'

@Component
class AppHeader extends Vue {
  get userSignedIn() {
    return authStore.userSignedIn
  }

  get userId() {
    return authStore.user!.id
  }

  get displayName() {
    return authStore.userDisplayName
  }

  get photoProps() {
    return {
      width: 32,
      height: 32,
      class: 'm1',
      src: authStore.user!.photoURL,
    }
  }

  login() {
    authStore.login()
  }

  logout() {
    authStore.logout().then((result) => {
      if (result) {
        this.$router.push('/')
      }
    })
  }
}
export default AppHeader
</script>
