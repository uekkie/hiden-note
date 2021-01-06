<template>
  <div>
    <div v-if="user" class="note-list__note-author">
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
    <div class="note-list__note-tags">
      <note-tag-list :tags="tags"></note-tag-list>
    </div>
    <div class="note-list__note-body">
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
  user?: User

  get userName() {
    return this.user?.displayName || 'no name'
  }

  get userPhotoProps() {
    return this.user?.photoProps()
  }

  get editPath() {
    return this.note!.id + '/edit'
  }

  get createdAt() {
    try {
      return this.note!.createdAt.toDate()
    } catch {
      return null
    }
  }

  get tags() {
    return Object.keys(this.note.tags).map((key) => key)
  }
}
export default NotesContainerItem
</script>
