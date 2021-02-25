<template>
  <b-container v-if="user" style="max-width: 720px">
    <h1 class="text-center">{{ user.displayName }}</h1>
    <h5>作成したノート: {{ notes ? notes.length : '' }}</h5>
    <b-list-group>
      <b-list-group-item v-for="note in notes" :key="note.id">
        <NuxtLink :to="{ name: 'notes-id', params: { id: note.id } }">
          <h5>{{ note.title }}</h5>
        </NuxtLink>
        <div class="text-muted">
          <div>作成日: {{ note.createdAtString() }}</div>
        </div>
      </b-list-group-item>
    </b-list-group>
  </b-container>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  useAsync,
} from '@nuxtjs/composition-api'
import { User, Note } from '@/models'
import { useUserStore } from '~/composables/use-user'
import { useNoteStore } from '~/composables/use-note'

type State = {
  user?: User
  notes: Note[]
}
export default defineComponent({
  setup(_props, ctx) {
    const { fetchUsers, getUserById } = useUserStore()
    const { getNotesByUserId } = useNoteStore()

    const state = reactive<State>({
      user: undefined,
      notes: [],
    })

    const userId = ctx.root.$route.params.userId
    state.user = getUserById(userId)
    useAsync(async () => {
      await fetchUsers()
      state.notes = await getNotesByUserId(userId)
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>
