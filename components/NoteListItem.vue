<template>
  <div>
    <div class="note-list__note-author">
      <div class="note-list__note-author-pic mr-3">
        <nuxt-link :to="`/users/${note.userId}`">
          <b-img thumbnail v-bind="userPhotoProps" rounded="circle"></b-img>
        </nuxt-link>
      </div>
      <div>
        <nuxt-link
          class="note-list__note-author-link"
          :to="`/users/${note.userId}`"
        >
          {{ userName }}
        </nuxt-link>
        <br />
        <time-label v-if="createdAt" :datetime="createdAt" />
      </div>
    </div>
    <div class="note-list__note-dody">
      <h3>
        <nuxt-link :to="`/notes/${note.id}`">{{ note.title }}</nuxt-link>
      </h3>
      <div class="note-list-item--body mt-5 ml-3">
        <markdown-preview :content="note.content"></markdown-preview>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Note, User } from '@/models'
@Component
class NotesContainerItem extends Vue {
  @Prop()
  note!: Note

  @Prop()
  user!: User

  get userName() {
    return this.user?.displayName || 'no name'
  }

  get userPhotoProps() {
    return this.user?.photoProps()
  }

  get editPath() {
    return this.note!.id + '/edit'
  }

  get tags() {
    return this.note.tags
      ? this.note.tags.map((tag) => {
          return { tagName: tag, noteCount: 0 }
        })
      : []
  }

  get createdAt() {
    try {
      return this.note!.createdAt.toDate()
    } catch {
      return null
    }
  }
}
export default NotesContainerItem
</script>
