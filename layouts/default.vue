<template>
  <div>
    <app-header class="mb-3" />
    <nuxt />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  onMounted,
  provide,
  useAsync,
} from '@nuxtjs/composition-api'
import useAuth, { AuthStore } from '@/composables/use-auth'
import AuthKey from '@/composables/use-auth-key'
import useTag, { TagStore } from '@/composables/use-tag'
import TagKey from '@/composables/use-tag-key'
import useNote from '@/composables/use-note'
import NoteKey from '@/composables/use-note-key'
import useComment from '@/composables/use-comment'
import CommentKey from '@/composables/use-comment-key'
import useUser, { UserStore } from '@/composables/use-user'
import UserKey from '@/composables/use-user-key'
import { auth } from '@/plugins/firebase'

export default defineComponent({
  setup(_props, { root }) {
    provide(AuthKey, useAuth())
    provide(TagKey, useTag())
    provide(NoteKey, useNote())
    provide(CommentKey, useComment())
    provide(UserKey, useUser())
    const { fetchTags } = inject(TagKey) as TagStore
    const { fetchUsers } = inject(UserKey) as UserStore
    useAsync(() => {
      fetchTags()
      fetchUsers()
    })

    const { setUser } = inject(AuthKey) as AuthStore

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
