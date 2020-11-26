<template>
  <div>
    <b-container v-if="isNoteShowPath && !loading">
      <b-row>
        <b-col cols="8">
          <h1>{{ note.title }}</h1>
          <div class="d-flex justify-content-end">
            <div class="edit">
              <b-icon variant="secondary" icon="pencil"></b-icon>
              <b-link class="text-secondary" :to="`edit/${noteId()}`"
                >編集する</b-link
              >
            </div>
            <div class="delete">
              <b-icon variant="danger" icon="trash"></b-icon>
              <b-link class="text-danger" @click="modalShow = !modalShow"
                >削除する</b-link
              >
            </div>
          </div>
          <tag-list :tags="note.tags" />

          <markdown-preview :content="note.content" />

          <b-modal
            v-model="modalShow"
            title="ノートの削除"
            @ok="handleDeleteNote"
            >削除してよろしいですか？</b-modal
          >
        </b-col>
        <b-col cols="4">
          <div class="histories">
            <h3>更新した人たち</h3>
            <b-list-group>
              <b-list-group-item
                v-for="(history, index) in noteHistories"
                :key="index"
              >
                <nuxt-link :to="`diff/${history.id}`">
                  {{ history.createdAtString() }}に{{
                    history.creatorName()
                  }}が更新
                </nuxt-link>
              </b-list-group-item>
            </b-list-group>
          </div>
          <div class="related">
            <h3>おなじタグの付いたノート</h3>
            <b-list-group>
              <b-list-group-item
                v-for="(note, index) in relatedNotes"
                :key="index"
              >
                <nuxt-link :to="`/notes/${note.id}`">{{
                  note.title
                }}</nuxt-link>
              </b-list-group-item>
            </b-list-group>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <nuxt-child></nuxt-child>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Note, NoteHistory } from '@/models/note'
import { notesStore } from '@/store'
import TagList from '~/components/tags/TagList.vue'

@Component({
  components: { TagList },
})
class NoteShow extends Vue {
  note: Note | null = null
  modalShow: boolean = false
  loading: boolean = true
  relatedNotes: Note[] = []
  noteHistories: NoteHistory[] = []

  created() {
    notesStore.getNote(this.$route.params.id).then((note) => {
      this.note = note
      this.loading = false
      if (note.tags.length > 0) {
        const tagName = note.tags[0]
        notesStore.getNotesByTagName(tagName).then((notes) => {
          this.relatedNotes = notes.filter((note) => {
            return note.id !== this.note!.id
          })
        })
      }

      notesStore.getNoteHistories(note.id).then((histories) => {
        this.noteHistories = histories
      })
    })
  }

  noteId() {
    return this.$route.params.id
  }

  get isNoteShowPath() {
    if (this.$route.name === 'notes-id') {
      return true
    } else {
      return false
    }
  }

  async handleDeleteNote(bvModalEvt: any) {
    bvModalEvt.preventDefault()
    await notesStore.deleteNote(this.$route.params.id)
    this.$router.push('/')
  }
}
export default NoteShow
</script>
