<template>
  <div>
    <button :disabled="isValid" @click="login">LOGIN</button>
    <button @click="$nuxt.refresh">REFRESH</button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from '@nuxtjs/composition-api'
import { AuthStore } from '@/composables/use-auth'
import AuthKey from '@/composables/use-auth-key'

export default defineComponent({
  setup() {
    const { user, loading, error, login } = inject(AuthKey) as AuthStore
    return {
      user,
      loading,
      error: computed(() => error.value),
      login,
    }
  },
})
</script>
