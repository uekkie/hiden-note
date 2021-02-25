<template>
  <div>
    <the-header class="mb-3" />
    <nuxt />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, useAsync } from '@nuxtjs/composition-api'
import { provideAuthStore, useAuthStore } from '@/composables/use-auth'
import { provideTagStore, useTagStore } from '@/composables/use-tag'
import { provideNoteStore } from '@/composables/use-note'
import { provideCommentStore } from '@/composables/use-comment'
import { useUserStore, provideUserStore } from '@/composables/use-user'
import { auth } from '@/plugins/firebase'

export default defineComponent({
  setup(_props, { root }) {
    provideAuthStore()
    provideTagStore()
    provideNoteStore()
    provideCommentStore()
    provideUserStore()
    const { fetchTags } = useTagStore()
    const { fetchUsers } = useUserStore()
    useAsync(() => {
      fetchTags()
      fetchUsers()
    })

    const { setUser } = useAuthStore()

    onMounted(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setUser(user)
        } else {
          setUser()
          root.$router.push('/')
        }
      })
    })
  },
})
</script>
<style lang="sass">
html
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
  font-size: 16px
  word-spacing: 1px
  -ms-text-size-adjust: 100%
  -webkit-text-size-adjust: 100%
  -moz-osx-font-smoothing: grayscale
  -webkit-font-smoothing: antialiased
  box-sizing: border-box

body
  background-color: #f8f9fa
*,
*::before,
*::after
  box-sizing: border-box
  margin: 0

.button--green
  display: inline-block
  border-radius: 4px
  border: 1px solid #3b8070
  color: #3b8070
  text-decoration: none
  padding: 10px 30px


  &:hover
    color: #fff
    background-color: #3b8070

.button--grey
  display: inline-block
  border-radius: 4px
  border: 1px solid #35495e
  color: #35495e
  text-decoration: none
  padding: 10px 30px
  margin-left: 15px

  &:hover
    color: #fff
    background-color: #35495e
</style>
