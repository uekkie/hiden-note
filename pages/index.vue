<template>
  <b-container>
    <template v-if="user">
      <tag-index :tags="tags" />
      <note-list />
    </template>
    <div v-else>ログインしてください</div>
  </b-container>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { AuthStore } from '@/composables/use-auth'
import AuthKey from '@/composables/use-auth-key'
import TagKey from '~/composables/use-tag-key'
import { TagStore } from '~/composables/use-tag'

export default defineComponent({
  setup() {
    const { user, loading } = inject(AuthKey) as AuthStore
    const { tags } = inject(TagKey) as TagStore
    return {
      tags,
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
