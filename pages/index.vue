<template>
  <b-container>
    <template v-if="user">
      <tag-index />
      <note-list />
    </template>
    <div v-else>
      <login-button />
      <div v-if="$nuxt.isOffline">You are offline</div>
      <div v-else>You are online</div>
      ログインしてください
    </div>
  </b-container>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { AuthStore } from '@/composables/use-auth'
import AuthKey from '@/composables/use-auth-key'

export default defineComponent({
  setup() {
    // provide(AuthKey, useAuth())
    const { user, loading } = inject(AuthKey) as AuthStore
    return {
      user,
      loading,
    }
  },
})
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
