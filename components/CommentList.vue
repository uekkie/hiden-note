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
import { db } from '@/plugins/firebase'
import { User, NoteComment } from '@/models'
import { usersStore } from '@/store'

@Component
class CommentForm extends Vue {
  @Prop({ default: false })
  noteId!: string

  users: User[] = []
  noteComments: NoteComment[] = []

  async created() {
    usersStore.initialize()
    this.noteComments = await this.getNoteComments(this.noteId)
    this.users = usersStore.users
  }

  get comments() {
    return this.noteComments
  }

  getUser(userId: string): User | null {
    const matchUsers = this.users.filter((user) => {
      return user.id === userId
    })

    return matchUsers.length === 0 ? null : matchUsers[0]
  }

  private async getNoteComments(noteId: string): Promise<NoteComment[]> {
    const commentsRef = db
      .collection('notes')
      .doc(noteId)
      .collection('comments')
    const querySnapshot = await commentsRef.orderBy('createdAt', 'desc').get()

    const comments: NoteComment[] = []
    querySnapshot.forEach((doc) => {
      comments.push(new NoteComment(Object.assign({ id: doc.id }, doc.data())))
    })
    return comments
  }
}
export default CommentForm
</script>

<style></style>
