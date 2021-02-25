<template>
  <b-container>
    <b-form @submit.prevent="searchNote">
      <label for="text-keyword">検索キ-ワード</label>
      <b-form-input v-model.trim="state.query" type="text" />
    </b-form>
    <div
      v-for="note in state.searchedNotes"
      :key="note.id"
      class="my-2 flex-column align-items-start"
    >
      <h3>
        <nuxt-link :to="`/notes/${note.id}`">{{ note.title }}</nuxt-link>
      </h3>
      <div>
        <small>
          <user-icon :user-id="note.userId" />
        </small>
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="content" v-html="formattedContent(note.content)" />
      <div class="text-right">
        <time-label :time-stamp="note.updatedAt.toMillis()" />
      </div>
      <hr />
    </div>
  </b-container>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from '@nuxtjs/composition-api'
import { algoliaClient } from '@/utils/algolia'
import { useNoteStore } from '@/composables/use-note'
import UserIcon from '~/components/UserIcon.vue'

const index = algoliaClient().initIndex('notes')
const md = require('markdown-it')().use(require('markdown-it-highlightjs'), {
  inline: true,
  html: false,
  linkify: true,
  breaks: true,
})

type State = {
  searchedNotes: any[]
  query: string
}
export default defineComponent({
  components: { UserIcon },
  setup(_props, ctx) {
    const { getNote } = useNoteStore()

    const state = reactive<State>({
      searchedNotes: [],
      query: '',
    })

    const canSubmit = computed(() => {
      const { query } = state
      return !!query && query.length > 0
    })
    const queryNote = async () => {
      const result = await index.search(state.query)
      result.hits.forEach(async (doc: any) => {
        const note = await getNote(doc.id)
        if (note.content) {
          state.searchedNotes.push(note)
        }
      })
    }
    state.query = ctx.root.$route.query.q as string
    queryNote()

    const searchNote = () => {
      if (state.query.length > 0) {
        ctx.root.$router.push({
          path: 'search',
          query: { q: state.query },
        })
        queryNote()
      }
    }

    const formattedContent = (content: string): string => {
      return md.render(content)
    }

    return {
      state,
      searchNote,
      formattedContent,
      canSubmit,
    }
  },
})
</script>
