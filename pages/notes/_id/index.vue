<template>
  <div>
    <b-row>
      <b-col cols="8">
        <note-show :note-id="noteId" />
      </b-col>
      <b-col cols="4">
        <note-editor-list :note-id="noteId"></note-editor-list>

        <div class="related">
          <h3>おなじタグの付いたノート</h3>
          <b-list-group>
            <b-list-group-item
              v-for="(note, index) in relatedNotes"
              :key="index"
            >
              <nuxt-link :to="`/notes/${note.id}`">{{ note.title }}</nuxt-link>
            </b-list-group-item>
          </b-list-group>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
} from '@nuxtjs/composition-api'
import { Note } from '@/models/note'
import 'highlight.js/styles/atom-one-light.css'

type State = {
  relatedNotes: Note[]
}
export default defineComponent({
  setup(_props, { root }) {
    const state = reactive<State>({
      relatedNotes: [],
    })

    const noteId = computed(() => {
      return root.$route.params.id
    })

    return {
      ...toRefs(state),
      noteId,
    }
  },
})
</script>
