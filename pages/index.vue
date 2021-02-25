<template>
  <b-container>
    <template v-if="user">
      <b-row>
        <b-col cols="2">
          <div class="tags_wrapper">
            <h2 class="h4">人気のタグ</h2>
            <tag-index :tags="tags" />
          </div>
        </b-col>
        <b-col>
          <note-list />
        </b-col>
      </b-row>
    </template>
    <div v-else>ログインしてください</div>
  </b-container>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useAuthStore } from '@/composables/use-auth'
import { useTagStore } from '~/composables/use-tag'

export default defineComponent({
  setup() {
    const { user, loading } = useAuthStore()
    const { tags } = useTagStore()
    return {
      tags,
      user,
      loading,
    }
  },
})
</script>

<style lang="sass">
.title
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
  display: block
  font-weight: 300
  font-size: 100px
  color: #35495e
  letter-spacing: 1px
.tags_wrapper
</style>
