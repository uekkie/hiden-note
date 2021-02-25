<template>
  <div>
    <b-navbar variant="light">
      <b-navbar-brand to="/">秘伝のタレ</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <template v-if="user">
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
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { useAuthStore } from '@/composables/use-auth'

export default defineComponent({
  setup() {
    const { user, error, login, logout } = useAuthStore()

    return {
      user,
      userId: computed(() => user!.value?.id),
      displayName: computed(() => user!.value?.displayName),
      photoProps: computed(() => {
        return user!.value?.photoProps()
      }),
      error: computed(() => error.value),
      login,
      logout,
    }
  },
})
</script>

<style lang="scss" scoped>
.header__new-note-button {
  width: 150px;
}
</style>
