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
        tag-list(:tags="tags(note)")

        markdown-preview(:content="note.content")

        comment-list(:noteId="note.id")
        comment-form(:noteId="note.id")

        b-modal(v-model="modalShow" title="ノートの削除" @ok="handleDeleteNote") 削除してよろしいですか？
      b-col(cols="4")
        note-editor-list(:noteId='note.id')

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

  async created() {
    this.note = await notesStore.getNote(this.$route.params.id)
    this.loading = false
    if (this.note.tags.length > 0) {
      const tagName = this.note.tags[0]
      const notes = await notesStore.getNotesByTagName(tagName)
      this.relatedNotes = notes.filter((note) => {
        return note.id !== this.note!.id
      })
    }
  }

  tags(note: Note) {
    return note.tags.map((tag) => {
      return { tagName: tag, noteCount: 0 }
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
