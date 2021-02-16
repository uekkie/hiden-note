<template>
  <b-container>
    <template v-if="user">
      <tag-index :tags="tags" />
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
import {
  defineComponent,
  inject,
  reactive,
  toRefs,
  useAsync,
} from '@nuxtjs/composition-api'
import { AuthStore } from '@/composables/use-auth'
import AuthKey from '@/composables/use-auth-key'
import { Tag } from '@/models/tag'
// import { User } from '@/models/user'
import TagKey from '~/composables/use-tag-key'
import { TagStore } from '~/composables/use-tag'

// type State = {
//   // user?: User
//   tags: Tag[]
// }
export default defineComponent({
  setup() {
    // const state = reactive<State>({
    //   // user: undefined,
    //   // tags: [],
    // })
    // const { fetchTags } = inject(TagKey) as TagStore
    const { user, loading } = inject(AuthKey) as AuthStore
    const { tags } = inject(TagKey) as TagStore
    return {
      // ...toRefs(state),
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
