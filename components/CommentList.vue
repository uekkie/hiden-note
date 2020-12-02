<template>
  <div>
    <h5>コメント</h5>
    <b-list-group class="mb-3">
      <b-list-group-item v-for="comment in comments" :key="comment.id">
        <div>
          <div class="text-muted mb-1">
            <span>
              <NuxtLink :to="{ path: `/users/${comment.userId}` }">
                {{ getUser(comment.userId).displayName }}
              </NuxtLink>
            </span>
            <span class="float-right">{{
              comment.createdAt ? comment.createdAtString() : ''
            }}</span>
          </div>
          <div style="white-space: pre-line">{{ comment.content }}</div>
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { User, NoteComment } from '@/models'
import { usersStore, commentsStore } from '@/store'

@Component
class CommentList extends Vue {
  @Prop({ default: false })
  noteId!: string

  noteComments: NoteComment[] = []

  async created() {
    usersStore.initialize()
    this.noteComments = await commentsStore.getNoteComments(this.noteId)
  }

  get comments() {
    return this.noteComments
  }

  getUser(userId: string): User | undefined {
    return usersStore.storedUsers.find((user) => user.id === userId)
  }
}
export default CommentList
</script>

<style></style>
