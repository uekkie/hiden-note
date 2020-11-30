<template lang="pug">
  b-container(v-if="!loading")
    b-row
      b-col(cols="8")
        h1 {{ note.title }}
        .d-flex.justify-content-end
          .edit
            b-icon(variant="secondary" icon="pencil")
            b-link.text-secondary(:to="editPath()") 編集する
          .delete
            b-icon(variant="danger" icon="trash")
            b-link.text-danger(@click="modalShow = !modalShow") 削除する
        tag-list(:tags="note.tags")

        markdown-preview(:content="note.content")

        comment-form(:noteId="note.id")

        b-modal(v-model="modalShow" title="ノートの削除" @ok="handleDeleteNote") 削除してよろしいですか？
      b-col(cols="4")
        note-editor-list(:noteId='note.id' )

        .related
          h3 おなじタグの付いたノート
          b-list-group
            b-list-group-item(v-for="(note, index) in relatedNotes" :key="index")
              nuxt-link(:to="`/notes/${note.id}`") {{ note.title }}
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Note } from '@/models/note'
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
    })
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
