<template>
  <div>
    <b-navbar class="header">
      <b-navbar-brand class="header__title" to="/">秘伝のタレ</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <template v-if="userSignedIn">
          <b-navbar-nav class="ml-auto">
            <b-nav-form class="mr-2">
              <header-search-bar />
            </b-nav-form>
            <b-nav-form>
              <b-button
                size="sm"
                to="/notes/new"
                variant="primary"
                type="submit"
                class="header__new-note-button"
              >
                <b-icon variant="outline-primary" icon="pencil"></b-icon>
                新規ノート作成
              </b-button>
            </b-nav-form>
            <b-nav-item>
              <b-nav-item-dropdown right>
                <template #button-content>
                  <b-img thumbnail fluid v-bind="photoProps" rounded="circle" />
                </template>
                <b-dropdown-item :to="{ path: `/users/${userId}` }">
                  {{ displayName }}
                </b-dropdown-item>
                <b-dropdown-item @click="logout">ログアウト</b-dropdown-item>
              </b-nav-item-dropdown>
            </b-nav-item>
          </b-navbar-nav>
        </template>
        <b-navbar-nav v-else class="ml-auto">
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

<style lang="sass" scoped>
@import '@/assets/stylesheets/_resources.sass'

.header
  height: $header-height

.header__new-note-button
  width: 150px

.header
  background-color: $brand-color

.header__title
  color: white
  &:hover
    color: white
</style>
