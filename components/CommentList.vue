<template>
  <div>
    <b-list-group class="mb-3">
      <b-list-group-item v-for="comment in comments" :key="comment.id">
        <div>
          <div class="text-muted mb-1">
            <span>
              <nuxt-link :to="{ path: `/users/${comment.userId}` }">
                {{ getUserName(comment.userId) }}
              </nuxt-link>
            </span>
            <span class="float-right">
              <time-label
                v-if="comment.createdAt"
                :datetime="comment.createdAt.toDate()"
              />
            </span>
          </div>
          <div style="white-space: pre-line">{{ comment.content }}</div>
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { User } from '@/models'
import { usersStore, notesStore } from '@/store'

@Component
class CommentList extends Vue {
  @Prop({ default: false })
  noteId!: string

  get comments() {
    return notesStore.storedComments
  }

  async created() {
    usersStore.initialize()
    if (this.noteId) {
      notesStore.watchNoteComments(this.noteId)
      await notesStore.storedNoteComments(this.noteId)
    } else {
      console.error('noteId not exists')
    }
  }

  getUser(userId: string): User | undefined {
    return usersStore.storedUsers.find((user) => user.id === userId)
  }

  getUserName(userId: string): string | undefined {
    const user = this.getUser(userId)
    return user ? user.displayName : 'no name'
  }
}
export default CommentList
</script>
