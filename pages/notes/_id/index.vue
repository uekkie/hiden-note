<template>
  <b-container v-if="!loading">
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
import { Vue, Component } from 'nuxt-property-decorator'
import { Note } from '@/models/note'
import { notesStore } from '@/store'
// import TagList from '~/components/tags/TagList.vue'
import 'highlight.js/styles/atom-one-light.css'

@Component({
  // components: { TagList },
})
class NoteShow extends Vue {
  private note: Note | null = null
  private modalShow: boolean = false
  private loading: boolean = true
  private relatedNotes: Note[] = []

  async created() {
    this.note = await notesStore.getNote(this.$route.params.id)
    if (this.note.tags && this.note.tags.length > 0) {
      const tagName = this.note.tags[0]
      const notes = await notesStore.getNotesByTagName(tagName)
      this.relatedNotes = notes.filter((note) => {
        return note.id !== this.note!.id
      })
    }
    this.loading = false
  }

  tags(note: Note) {
    return note.tags
      ? note.tags.map((tag) => {
          return { tagName: tag, noteCount: 0 }
        })
      : []
  }

  editPath() {
    return this.note!.id + '/edit'
  }

  async handleDeleteNote(bvModalEvt: any) {
    bvModalEvt.preventDefault()
    await notesStore.deleteNote(this.$route.params.id)
    this.$router.push('/')
  }
}
export default NoteShow
</script>
