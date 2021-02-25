<template>
  <div v-if="notes" class="notes">
    <article
      v-for="(note, index) in recentNotes"
      :key="index"
      class="note-list__item mb-3"
    >
      <h3>
        <nuxt-link :to="`/notes/${note.id}`">{{ note.title }}</nuxt-link>
      </h3>
      <div class="note-list__meta">
        <small>
          <b-img
            thumbnail
            v-bind="photoProps(note.userId)"
            rounded="circle"
          ></b-img>
          <NuxtLink :to="`/users/${note.userId}`">
            {{ userName(note.userId) }}
          </NuxtLink>
          <time-label :time-stamp="note.updatedAt.toMillis()" />
        </small>
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="note-list__content" v-html="formattedContent(note.content)" />
    </article>
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
import TimeLabel from './TimeLabel.vue'
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
  components: { TimeLabel },
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
<style lang="scss">
.note-list__item {
  background-color: white;
  border-radius: 9px;
  min-width: 0;
  box-shadow: 0 0 0 1px gray;
  padding: 14px 12px;
  .note-list__meta {
    width: 100%;
    padding-left: 20px;
  }
  .note-list__content {
    padding-left: 20px;
  }
}
</style>
