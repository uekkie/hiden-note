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
  PropType,
  useAsync,
  onMounted,
} from '@nuxtjs/composition-api'
import { useCommentStore } from '@/composables/use-comment'
import { useUserStore } from '@/composables/use-user'

export default defineComponent({
  props: {
    noteId: {
      type: String as PropType<string>,
      require: true,
    },
  },
  setup(props) {
    const { fetchComments, comments } = useCommentStore()
    const { fetchUsers, getUserById } = useUserStore()
    onMounted(() => {
      useAsync(() => {
        fetchComments(props.noteId!)
        fetchUsers()
      })
    })
    const getUserName = (userId: string) => {
      return getUserById(userId)?.displayName
    }
    return {
      comments,
      getUserName,
    }
  },
})
</script>
