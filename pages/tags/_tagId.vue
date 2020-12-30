<template>
  <b-container>
    <h3>
      タグ <code>#{{ tagName }}</code> が付いているノート
    </h3>
    <b-list-group>
      <b-list-group-item
        variant="primary"
        class="flex-column align-items-start"
      >
        <b-row>
          <b-col>タイトル</b-col>
          <b-col>更新日</b-col>
        </b-row>
      </b-list-group-item>
      <b-list-group-item
        v-for="(note, index) in notes"
        :key="index"
        class="flex-column align-items-start"
      >
        <b-row>
          <b-col>
            <nuxt-link :to="`/notes/${note.id}`"> {{ note.title }}</nuxt-link>
          </b-col>
          <b-col>
            <time-label
              v-if="note.updatedAt"
              :datetime="note.updatedAt.toDate()"
            />
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { notesStore } from '@/store'
import { Note } from '@/models'

@Component
class TagShow extends Vue {
  tagName: string = ''
  notes: Note[] = []
  async created() {
    this.tagName = this.$route.params.tagId
    this.notes = await notesStore.getNotesByTagName(this.tagName)
  }
}
export default TagShow
</script>
