<template>
  <div>
    <b-navbar>
      <b-navbar-brand href="#">秘伝のタレ</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="userSignedIn">
          <b-nav-item @click="logout">ログアウト</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav v-else>
          <b-nav-item @click="login">ログイン</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  computed: {
    userSignedIn() {
      return this.$store.getters.currentUser != null
    },
  },
  methods: {
    login() {
      this.$store.dispatch('login')
    },
    logout() {
      this.$store.dispatch('logout')
    },
  },
})
</script>
<style></style>
