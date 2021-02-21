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
  reactive,
  toRefs,
  useAsync,
} from '@nuxtjs/composition-api'
import { Note } from '@/models/note'
import { Tag } from '@/models/tag'
import 'highlight.js/styles/atom-one-light.css'

type State = {
  tags: Tag[]
}
export default defineComponent({
  props: {
    note: {
      type: Note,
      require: true,
    },
  },
  setup(props) {
    const state = reactive<State>({
      tags: [],
    })
    useAsync(() => {
      state.tags = Object.keys(props.note!.tags).map((key) => new Tag(key, 0))
    })

    const editPath = () => {
      return props.note!.id + '/edit'
    }
    return {
      ...toRefs(state),
      editPath,
    }
  },
})
</script>
