<template>
  <b-container>
    <template v-if="user">
      <div class="notes__tag-index">
        <tag-index />
      </div>
      <div class="notes__note-list my-3">
        <note-list />
      </div>
    </template>
    <div v-else>ログインしてください</div>
  </b-container>
</template>

<script lang="ts">
import useAuth from '@/use/use-auth'
import { defineComponent } from '@nuxtjs/composition-api'
import { notesStore, usersStore } from '@/store'
import 'highlight.js/styles/atom-one-light.css'

export default defineComponent({
  setup() {
    const { user } = useAuth()
    return {
      user,
    }
  },
  async created() {
    await notesStore.initialize()
    await usersStore.initialize()
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
