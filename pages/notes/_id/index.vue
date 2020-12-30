<template>
  <b-container v-if="!loading">
    <b-row>
      <b-col cols="8">
        <note-content :note="note" :user="user(note.userId)" />

        <div class="note--comment-list my-3">
          <h5>コメント一覧</h5>
          <comment-list :note-id="note.id"></comment-list>
        </div>
        <div class="note--comment-form mt-3">
          <h5>コメント投稿</h5>
          <comment-form :note-id="note.id"></comment-form>
        </div>

        <b-modal
          v-model="modalShow"
          title="ノートの削除"
          @ok="handleDeleteNote"
        >
          削除してよろしいですか？
        </b-modal>
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
import { notesStore, usersStore } from '@/store'
import NoteTagList from '~/components/NoteTagList.vue'
import 'highlight.js/styles/atom-one-light.css'

@Component({
  components: { NoteTagList },
})
class NoteShow extends Vue {
  private note: Note | null = null
  private modalShow: boolean = false
  private loading: boolean = true
  private relatedNotes: Note[] = []

  get users() {
    return usersStore.users
  }

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

  async handleDeleteNote(bvModalEvt: any) {
    bvModalEvt.preventDefault()
    await notesStore.deleteNote(this.$route.params.id)
    this.$router.push('/')
  }

  user(userId: string) {
    return this.users.find((user) => user.id === userId)
  }
}
export default NoteShow
</script>
