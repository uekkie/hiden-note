<template>
  <b-container v-if="note">
    <b-row>
      <b-col cols="8">
        <note-show :note="note" />
      </b-col>
      <b-col cols="4">
        <note-editor-list :note-id="note.id"></note-editor-list>

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
  </b-container>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  useAsync,
  reactive,
  toRefs,
} from '@nuxtjs/composition-api'
import { Note } from '@/models/note'
import { notesStore } from '@/store'
import 'highlight.js/styles/atom-one-light.css'
import NoteKey from '~/composables/use-note-key'
import { NoteStore } from '~/composables/use-note'

type State = {
  note?: Note
  relatedNotes: Note[]
  modalShow: boolean
}
export default defineComponent({
  setup(_props, ctx) {
    const { getNote } = inject(NoteKey) as NoteStore

    const state = reactive<State>({
      note: undefined,
      relatedNotes: [],
      modalShow: false,
    })
    useAsync(async () => {
      state.note = await getNote(ctx.root.$route.params.id)
    })

    const handleDeleteNote = async (bvModalEvt: any) => {
      bvModalEvt.preventDefault()
      await notesStore.deleteNote(ctx.root.$route.params.id)
      ctx.root.$router.push('/')
    }
    return {
      ...toRefs(state),
      handleDeleteNote,
    }
  },
})
</script>
