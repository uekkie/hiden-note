<template>
  <b-container>
    <h3>「{{ tagName }}」が付いているノート表示</h3>
    <b-list-group>
      <b-list-group-item
        variant="primary"
        class="flex-column align-items-start"
      >
        <b-row>
          <b-col>タイトル</b-col>
          <b-col>更新日</b-col>
        </b-row>
      </b-list-group-item>
      <b-list-group-item
        v-for="(note, index) in notes"
        :key="index"
        class="flex-column align-items-start"
      >
        <b-row>
          <b-col>
            <nuxt-link :to="`/notes/${note.id}`"> {{ note.title }}</nuxt-link>
          </b-col>
          <b-col>
            <time-label :time-stamp="note.updatedAt.toMillis()" />
          </b-col>
        </b-row>
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

import { Note } from '@/models'
import { useNoteStore } from '~/composables/use-note'

type State = {
  tagName: string
  notes: Note[]
}
export default defineComponent({
  setup(_props, ctx) {
    const { getNotesByTagName } = useNoteStore()

    const state = reactive<State>({
      tagName: '',
      notes: [],
    })

    state.tagName = ctx.root.$route.params.tagId
    useAsync(async () => (state.notes = await getNotesByTagName(state.tagName)))

    return { ...toRefs(state) }
  },
})
</script>
