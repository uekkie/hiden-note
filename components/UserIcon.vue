<template>
  <div v-if="user" class="user-icon">
    <b-img v-bind="user.photoProps()" rounded="circle"></b-img>
    <NuxtLink :to="`/users/${user.id}`">
      {{ user.displayName }}
    </NuxtLink>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  inject,
  reactive,
  useAsync,
  toRefs,
} from '@nuxtjs/composition-api'
import { User } from '@/models/user'
import UserKey from '~/composables/use-user-key'
import { UserStore } from '~/composables/use-user'

type State = {
  user?: User
}
export default defineComponent({
  props: {
    userId: {
      type: String,
      require: true,
    },
  },
  setup(props) {
    const state = reactive<State>({
      user: undefined,
    })
    const { fetchUsers, getUserById } = inject(UserKey) as UserStore
    useAsync(async () => {
      await fetchUsers()
      const userId = props.userId!
      state.user = getUserById(userId)
    })
    return {
      ...toRefs(state),
    }
  },
})
</script>
