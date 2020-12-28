<template>
  <b-container>
    <template v-if="user">
      <tag-index />
      <note-list />
    </template>
    <div v-else>
      <button :disabled="isValid" @click="login">LOGIN</button>
      ログインしてください
    </div>
  </b-container>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'
import useAuth from '@/use/use-auth'
import useLogin from '@/use/use-login'

export default defineComponent({
  setup() {
    const { user, loading, error } = useAuth()
    const loginState = useLogin()
    return {
      user,
      loading,
      error: computed(() => (loginState.error || error).value),
      login: loginState.login,
      logout: loginState.logout,
      isValid: loginState.isValid,
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
