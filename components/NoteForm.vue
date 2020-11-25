<template>
  <b-container>
    <form @submit.prevent="submit">
      <b-row align-v="start">
        <b-col>
          <b-form-input
            v-model.trim="title"
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
            v-model.trim="content"
            placeholder="markdownでかけるよ"
            rows="30"
            required
          ></b-form-textarea>
        </b-col>
        <b-col class="pl-0">
          <div class="px-2 py-1 border h-100">
            <markdown-preview :content="content" />
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
import Vue from 'vue'

export default Vue.extend({
  props: {
    submitLabel: {
      type: String,
      required: true,
      default: '保存する',
    },
    title: {
      type: String,
      required: false,
      default: '',
    },
    content: {
      type: String,
      required: false,
      default: '',
    },
    tags: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {}
  },
  computed: {
    canSubmit(): boolean {
      return this.title.length > 0 && this.content.length > 0
    },
  },
  methods: {
    submit() {
      this.$emit('submit', { title: this.title, content: this.content, tags: this.tags })
    },
  },
})
</script>
<style></style>
