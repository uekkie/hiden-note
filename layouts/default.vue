<template>
  <div>
    <app-header class="mb-3" />
    <nuxt />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide } from '@nuxtjs/composition-api'
import useAuth from '@/composables/use-auth'
import AuthKey from '@/composables/use-auth-key'
import useTag from '@/composables/use-tag'
import TagKey from '@/composables/use-tag-key'
import useNote from '@/composables/use-note'
import NoteKey from '@/composables/use-note-key'
import useComment from '@/composables/use-comment'
import CommentKey from '@/composables/use-comment-key'
import useUser from '@/composables/use-user'
import UserKey from '@/composables/use-user-key'

export default defineComponent({
  setup() {
    provide(AuthKey, useAuth())
    provide(TagKey, useTag())
    provide(NoteKey, useNote())
    provide(CommentKey, useComment())
    provide(UserKey, useUser())
    return {}
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
