<template>
  <div>
    <h5>コメント</h5>
    <b-list-group class="mb-3">
      <b-list-group-item v-for="comment in comments" :key="comment.id">
        <div>
          <div class="text-muted mb-1">
            <span>
              <NuxtLink :to="{ path: `/users/${comment.userId}` }">
                {{ getUserName(comment.userId) }}
              </NuxtLink>
            </span>
            <span class="float-right">
              {{ comment.createdAt ? comment.createdAtString() : '' }}
            </span>
          </div>
          <div style="white-space: pre-line">{{ comment.content }}</div>
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  PropType,
  useAsync,
  onMounted,
} from '@nuxtjs/composition-api'
import { CommentStore } from '@/composables/use-comment'
import CommentKey from '@/composables/use-comment-key'
import { UserStore } from '@/composables/use-user'
import UserKey from '@/composables/use-user-key'

export default defineComponent({
  props: {
    noteId: {
      type: String as PropType<string>,
      require: true,
    },
  },
  setup(props) {
    onMounted(() => {
      const { fetchComments } = inject(CommentKey) as CommentStore
      const { fetchUsers } = inject(UserKey) as UserStore
      useAsync(() => {
        fetchComments(props.noteId!)
        fetchUsers()
      })
    })

    const { comments } = inject(CommentKey) as CommentStore

    const getUserName = (userId: string) => {
      const { getUserById } = inject(UserKey) as UserStore
      return getUserById(userId)?.displayName
    }
    return {
      comments,
      getUserName,
    }
  },
})
</script>
