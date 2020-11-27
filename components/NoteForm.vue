<template lang="pug">
  b-container(v-if="note")
    form(@submit.prevent="submit")
      b-row(align-v="start")
        b-col
          b-form-input(
            v-model.trim="note.title"
            required
            placeholder="タイトルをいれてね"
          )

      b-row(align-v="start")
        b-col
          b-form-input(
            v-model.trim="tags"
            placeholder="タグ 例）firestoreのつかいかた"
          )

      b-row(align-v="stretch")
        b-col.pr-0
          b-form-textarea(v-model.trim="note.content"
            placeholder="markdownでかけるよ"
            rows="30"
            required)
        b-col.pl-0
          .px-2.py-1.border.h-100
            markdown-preview(:content="note.content")

      b-row(align-v="end")
        b-col
          b-button(
            variant="success float-right mt-2"
            :disabled="!canSubmit"
            type="submit"
          ) {{ submitLabel }}
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
