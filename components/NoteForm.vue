<template>
  <b-container v-if="note">
    <form @submit.prevent="submit">
      <b-row align-v="start">
        <b-col>
          <b-form-input
            v-model.trim="note.title"
            required
            placeholder="タイトルをいれてね"
          ></b-form-input>
        </b-col>
      </b-row>

      <b-row align-v="start">
        <b-col>
          <b-form-input
            v-model.trim="tags"
            placeholder="タグ 例）firestoreのつかいかた"
          ></b-form-input>
        </b-col>
      </b-row>

      <b-row align-v="stretch">
        <b-col class="pr-0">
          <b-form-textarea
            v-model.trim="note.content"
            placeholder="markdownでかけるよ"
            rows="30"
            required
          ></b-form-textarea>
        </b-col>
        <b-col class="pl-0">
          <div class="px-2 py-1 border h-100">
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
            >{{ submitLabel }}</b-button
          >
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
  tags = ''

  @Prop({ default: false })
  submitLabel!: string

  @Prop({
    default: false,
    required: true,
  })
  note!: Note

  get canSubmit(): boolean {
    if (!this.note) return false
    return this.note.title.length > 0 && this.note.content.length > 0
  }

  created() {
    this.tags = this.note.tags.join(',')
  }

  tagsToArray(): string[] {
    return this.tags.split(',')
  }

  submit() {
    this.$emit('submit', {
      title: this.note?.title,
      content: this.note?.content,
      tags: this.tagsToArray(),
    })
  }
}
export default NoteForm
</script>
<style></style>
