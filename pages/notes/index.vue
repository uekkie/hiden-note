<template>
  <b-container>
    <template v-if="user">
      <div class="notes__tag-index">
        <tag-index :tags="tags" />
      </div>
      <div class="notes__note-list my-3">
        <note-list />
      </div>
    </template>
    <div v-else>ログインしてくださいa</div>
  </b-container>
</template>

<script lang="ts">
import { useAuthStore } from '@/composables/use-auth'
import { defineComponent } from '@nuxtjs/composition-api'
import 'highlight.js/styles/atom-one-light.css'

export default defineComponent({
  setup() {
    const { user } = useAuthStore()
    return {
      user,
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
</style>
