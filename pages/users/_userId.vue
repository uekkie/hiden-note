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
  inject,
  useAsync,
} from '@nuxtjs/composition-api'
import { User, Note } from '@/models'
import UserKey from '~/composables/use-user-key'
import { UserStore } from '~/composables/use-user'
import NoteKey from '~/composables/use-note-key'
import { NoteStore } from '~/composables/use-note'

type State = {
  user?: User
  notes: Note[]
}
export default defineComponent({
  setup(_props, ctx) {
    const state = reactive<State>({
      user: undefined,
      notes: [],
    })

    const { fetchUsers, getUserById } = inject(UserKey) as UserStore
    const { getNotesByUserId } = inject(NoteKey) as NoteStore
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
