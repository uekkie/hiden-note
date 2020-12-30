<template>
  <b-container v-if="note">
    <form @submit.prevent="submit">
      <b-row class="mb-2" align-v="start">
        <b-col>
          <b-form-input
            v-model.trim="note.title"
            required
            placeholder="タイトルをいれてね"
          />
        </b-col>
      </b-row>
      <b-row class="mb-2" align-v="start">
        <b-col>
          <b-form-tags
            v-model.trim="tags"
            placeholder="タグ 例）firestoreのつかいかた"
          />
        </b-col>
      </b-row>
      <b-row class="mb-2" align-v="stretch">
        <b-col class="pr-0">
          <b-form-textarea
            v-model.trim="note.content"
            placeholder="markdownでかけるよ"
            rows="30"
            required
          />
        </b-col>
        <b-col class="pl-0">
          <div class="note-preview px-2 py-1 border h-100">
            <markdown-preview :content="note.content" />
          </div>
        </b-col>
      </b-row>
      <b-row align-v="end">
        <b-col>
          <b-button
            variant="success float-right mt-2"
            :disabled="!canSubmit"
            type="submit"
          >
            {{ submitLabel }}
          </b-button>
        </b-col>
      </b-row>
    </form>
  </b-container>
</template>

<script lang="ts">
import { Note } from '@/models/note'
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({})
class NoteForm extends Vue {
  @Prop({ default: false })
  submitLabel!: string

  @Prop({
    default: false,
    required: true,
  })
  note!: Note

  private tags: string[] = []

  get canSubmit(): boolean {
    if (!this.note) return false
    return this.note.title.length > 0 && this.note.content.length > 0
  }

  created() {
    this.tags = this.note.tags
  }

  submit() {
    this.$emit('submit', {
      title: this.note?.title,
      content: this.note?.content,
      tags: this.tags,
    })
  }
}
export default NoteForm
</script>
<style lang="sass">
.note-preview
  background-color: #fff
</style>
