<template>
  <div v-if="notes" class="notes">
    <h3>ノート一覧</h3>
    <p>ノート総数：{{ notes.length }}</p>

    <div
      v-for="(note, index) in recentNotes"
      :key="index"
      class="flex-column align-items-start"
    >
      <h3>
        <nuxt-link :to="`/notes/${note.id}`">{{ note.title }}</nuxt-link>
      </h3>
      <div>
        <small>
          <b-img v-bind="photoProps(note.userId)" rounded="circle"></b-img>
          <NuxtLink :to="`/users/${note.userId}`">
            {{ userName(note.userId) }}
          </NuxtLink>
        </small>
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="content" v-html="formattedContent(note.content)" />
      <div class="text-right">
        <small>{{ formatDate(note.updatedAt.toDate()) }}</small>
      </div>
      <hr />
    </div>
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  reactive,
  toRefs,
} from '@nuxtjs/composition-api'
import { DateTime } from 'luxon'
import { useNoteStore } from '~/composables/use-note'
import { useUserStore } from '~/composables/use-user'
import { Note, User } from '~/models'

const md = require('markdown-it')().use(require('markdown-it-highlightjs'), {
  inline: true,
  html: false,
  linkify: true,
  breaks: true,
})

type State = {
  users: User[]
  notes: Note[]
}
export default defineComponent({
  setup() {
    const { watchNotes, unsubscribeNotes, notes } = useNoteStore()
    const { users } = useUserStore()

    const state = reactive<State>({
      users: [],
      notes: [],
    })

    state.users = reactive(users)
    state.notes = reactive(notes)

    watchNotes()

    onBeforeUnmount(() => {
      unsubscribeNotes()
    })

    const formattedContent = (content: string): string => {
      return md.render(content)
    }

    const getUser = (userId: string) => {
      return state.users.find((user) => user.id === userId)
    }

    const userName = (userId: string) => {
      return getUser(userId)?.displayName
    }

    const photoProps = (userId: string) => {
      return getUser(userId)?.photoProps()
    }

    const formatDate = (date: Date): string => {
      return DateTime.fromJSDate(date).toISODate()
    }
    const recentNotes = computed(() => {
      return state.notes.sort((note1, note2) =>
        note1.updatedAt > note2.updatedAt ? -1 : 0
      )
    })

    return {
      ...toRefs(state),
      formattedContent,
      userName,
      photoProps,
      formatDate,
      recentNotes,
    }
  },
})
</script>
