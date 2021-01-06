<template>
  <b-row>
    <b-col cols="3">
      <b-img v-bind="photoProps" rounded="circle"></b-img>
    </b-col>
    <b-col
      ><nuxt-link :to="`${noteId}/diff/${history.id}`">
        {{ userName }}
      </nuxt-link>
      <br />
      <time-label v-if="createdAt" :datetime="createdAt" />
    </b-col>
  </b-row>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { NoteHistory } from '@/models/note'
import { User } from '@/models'

@Component
class NoteEditorContainerItem extends Vue {
  @Prop({ default: false })
  noteId!: string

  @Prop({ default: false })
  history!: NoteHistory

  @Prop({ default: false })
  user!: User

  get userName() {
    return this.user?.displayName || ''
  }

  get createdAt() {
    try {
      return this.history!.createdAt.toDate()
    } catch {
      return null
    }
  }

  get photoProps() {
    return {
      width: 32,
      height: 32,
      class: 'm1',
      src: this.user!.photoURL,
    }
  }
}
export default NoteEditorContainerItem
</script>
