<template>
  <b-container v-if="!loading">
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

    <b-modal v-model="modalShow" title="ノートの削除" @ok="handleDeleteNote"
      >削除してよろしいですか？</b-modal
    >
  </b-container>
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

  created() {
    notesStore.getNote(this.$route.params.id).then((note) => {
      this.note = note
      this.loading = false
    })
  }

  noteId() {
    return this.$route.params.id
  }

  async handleDeleteNote(bvModalEvt: any) {
    bvModalEvt.preventDefault()
    await notesStore.deleteNote(this.$route.params.id)
    this.$router.push('/')
  }
}
export default NoteShow
</script>
