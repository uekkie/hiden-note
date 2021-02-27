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
  reactive,
  useAsync,
  toRefs,
} from '@nuxtjs/composition-api'
import { User } from '@/models/user'
import { useUserStore } from '~/composables/use-user'

type State = {
  user?: User
}
type Props = {
  userId: string
}
export default defineComponent({
  props: {
    userId: {
      type: String,
      require: true,
    },
  },
  setup(props: Props) {
    const { fetchUsers, getUserById } = useUserStore()

    const state = reactive<State>({
      user: undefined,
    })

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
