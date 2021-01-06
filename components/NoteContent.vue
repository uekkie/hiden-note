<template>
  <div class="note">
    <h1 class="note__title">{{ note.title }}</h1>
    <div class="note__author">
      <div class="note__author-pic mr-3">
        <nuxt-link :to="`/users/${note.userId}`">
          <b-img thumbnail v-bind="userPhotoProps" rounded="circle"></b-img>
        </nuxt-link>
      </div>
      <div>
        <nuxt-link class="note__author-link" :to="`/users/${note.userId}`">
          {{ userName }}
        </nuxt-link>
        <br />
        <time-label v-if="updatedAt" :datetime="updatedAt" />
      </div>
    </div>
    <div class="d-flex justify-content-end">
      <div class="edit">
        <b-icon variant="secondary" icon="pencil"></b-icon>
        <b-link class="text-secondary" :to="editPath">編集する</b-link>
      </div>
      <div class="delete">
        <b-icon variant="danger" icon="trash"></b-icon>
        <b-link class="text-danger" @click="modalShow = !modalShow"
          >削除する</b-link
        >
      </div>
    </div>
    <note-tag-list :tags="tags"></note-tag-list>
    <div class="note--body mt-5 ml-3">
      <markdown-preview :content="note.content"></markdown-preview>
    </div>
    <b-modal v-model="modalShow" title="ノートの削除" @ok="onDeleteNote">
      削除してよろしいですか？
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'nuxt-property-decorator'
import { Note, User } from '@/models'
@Component
class NoteContent extends Vue {
  private modalShow: boolean = false
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
    return Object.keys(this.note.tags).map((key) => key)
  }

  get updatedAt() {
    try {
      return this.note!.updatedAt.toDate()
    } catch {
      return null
    }
  }

  @Emit('onDeleteNote')
  onDeleteNote() {}
}
export default NoteContent
</script>

<style lang="sass">
@import '@/assets/stylesheets/_resources.sass'
.note
  background: $note-background
  box-shadow: 0 0 0 1px #ddd
  border-radius: 5px
  padding: 1rem
.note__author
  display: flex
  align-items: center
  justify-content: flex-start
.note__author-pic
  width: 32px
  height: 32px
.note__author-link
  color: black
  &:hover
    text-decoration: none
    color: #333
.note__body
  padding-left: 3rem
</style>
