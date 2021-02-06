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
import {
  defineComponent,
  computed,
  SetupContext,
  reactive,
} from '@nuxtjs/composition-api'

type Props = {
  submitLabel: string
  note: Note
}
export default defineComponent({
  props: {
    submitLabel: {
      type: String,
      required: true,
    },
    note: {
      type: Note,
      required: true,
    },
  },
  setup(props: Props, context: SetupContext) {
    const tags = reactive<string[]>([])

    const canSubmit = computed((): boolean => {
      if (!props.note) return false
      return props.note.title.length > 0 && props.note.content.length > 0
    })

    const submit = () => {
      context.emit('submit', {
        title: props.note?.title,
        content: props.note?.content,
        tags,
      })
    }
    return {
      tags,
      canSubmit,
      submit,
    }
  },
})
</script>
