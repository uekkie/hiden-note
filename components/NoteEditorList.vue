<template>
  <div class="histories">
    <h3>更新した人たち</h3>
    <b-list-group-item v-for="(history, index) in noteHistories" :key="index">
      <b-row>
        <b-col cols="3">
          <b-img v-bind="userIconProps(history.userId)" rounded="circle" />
        </b-col>
        <b-col>
          <nuxt-link :to="`${noteId}/diff/${history.id}`">
            {{ getUserName(history.userId) }}
          </nuxt-link>
          <br />
          {{ history.createdAtString() }}
        </b-col>
      </b-row>
    </b-list-group-item>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  useAsync,
} from '@nuxtjs/composition-api'
import { NoteHistory } from '@/models/note'
import { useNoteStore } from '~/composables/use-note'
import { useUserStore } from '~/composables/use-user'

type State = {
  noteHistories: NoteHistory[]
}

type Props = {
  noteId: string
}
export default defineComponent({
  props: {
    noteId: {
      type: String,
      required: true,
    },
  },
  setup(props: Props) {
    const { getUserById } = useUserStore()
    const { recentNoteHistories } = useNoteStore()

    const state = reactive<State>({
      noteHistories: [],
    })

    useAsync(async () => {
      state.noteHistories = await recentNoteHistories({
        noteId: props.noteId!,
        limit: 5,
      })
    })

    const userIconProps = (userId: string) => {
      return getUserById(userId)?.photoProps()
    }

    const getUserName = (userId: string): string => {
      const user = getUserById(userId)
      return user ? user.displayName : '不明'
    }

    return {
      ...toRefs(state),
      userIconProps,
      getUserById,
      getUserName,
    }
  },
})
</script>
