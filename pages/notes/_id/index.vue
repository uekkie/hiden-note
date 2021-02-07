<template>
  <b-container v-if="note">
    <b-row>
      <b-col cols="8">
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
        <!-- <tag-list :tags="tags(note)"></tag-list> -->

        <markdown-preview :content="note.content"></markdown-preview>

        <comment-list :note-id="note.id"></comment-list>
        <comment-form :note-id="note.id"></comment-form>

        <b-modal v-model="modalShow" title="ノートの削除" @ok="handleDeleteNote"
          >削除してよろしいですか？</b-modal
        >
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
import { defineComponent, inject, useAsync, ref } from '@nuxtjs/composition-api'
import { Note } from '@/models/note'
import { notesStore } from '@/store'
// import TagList from '~/components/tags/TagList.vue'
import 'highlight.js/styles/atom-one-light.css'
import NoteKey from '~/composables/use-note-key'
import { NoteStore } from '~/composables/use-note'

export default defineComponent({
  setup(_props, ctx) {
    const modalShow = ref(false)

    const { getNote } = inject(NoteKey) as NoteStore
    const note = useAsync(() => getNote(ctx.root.$route.params.id))

    const relatedNotes: Note[] = []

    // if (note.tags && note.tags.length > 0) {
    // const tagName = note.tags[0]
    // const notes = await notesStore.getNotesByTagName(tagName)
    // relatedNotes = notes.filter((note) => {
    //   return note.id !== note!.id
    // })
    // }
    // loading = false

    const tags = (note: Note) => {
      return note.tags
        ? note.tags.map((tag) => {
            return { tagName: tag, noteCount: 0 }
          })
        : []
    }

    const editPath = () => {
      return note.value!.id + '/edit'
    }

    const handleDeleteNote = async (bvModalEvt: any) => {
      bvModalEvt.preventDefault()
      await notesStore.deleteNote(ctx.root.$route.params.id)
      ctx.root.$router.push('/')
    }
    return {
      note,
      relatedNotes,
      tags,
      editPath,
      handleDeleteNote,
      modalShow,
    }
  },
})
</script>
