<template>
  <b-container v-if="note">
    <h1>{{ note.title }}</h1>
    <div class="d-flex justify-content-end">
      <div class="edit">
        <b-icon variant="secondary" icon="pencil"></b-icon>
        <b-link class="text-secondary" :to="editPath()">編集する</b-link>
      </div>
      <div class="delete">
        <b-icon variant="danger" icon="trash"></b-icon>
        <b-link class="text-danger" @click="modalShow = !modalShow"
          >削除する</b-link
        >
      </div>
    </div>
    <note-tag-list :tags="tags" />

    <markdown-preview :content="note.content"></markdown-preview>

    <comment-list :note-id="note.id"></comment-list>
    <comment-form :note-id="note.id"></comment-form>

    <b-modal v-model="modalShow" title="ノートの削除" @ok="handleDeleteNote"
      >削除してよろしいですか？</b-modal
    >
  </b-container>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  reactive,
  toRefs,
  useAsync,
} from '@nuxtjs/composition-api'
import { Note } from '@/models/note'
import { Tag } from '@/models/tag'
import 'highlight.js/styles/atom-one-light.css'
import NoteKey from '~/composables/use-note-key'
import { NoteStore } from '~/composables/use-note'

type State = {
  note?: Note
  tags: Tag[]
  modalShow: boolean
}
export default defineComponent({
  props: {
    noteId: {
      type: String,
      require: true,
    },
  },
  setup(props, { root }) {
    const state = reactive<State>({
      note: undefined,
      tags: [],
      modalShow: false,
    })
    const { getNote } = inject(NoteKey) as NoteStore

    // const state = reactive<State>({
    //   note: undefined,
    //   relatedNotes: [],
    // })
    useAsync(async () => {
      state.note = await getNote(props.noteId!)
      state.tags = Object.keys(state.note!.tags).map((key) => new Tag(key, 0))
    })

    const { deleteNote } = inject(NoteKey) as NoteStore
    const editPath = () => {
      return state.note!.id + '/edit'
    }
    const handleDeleteNote = async (bvModalEvt: any) => {
      bvModalEvt.preventDefault()
      await deleteNote(root.$route.params.id)
      root.$router.push('/')
    }
    return {
      ...toRefs(state),
      editPath,
      handleDeleteNote,
    }
  },
})
</script>
