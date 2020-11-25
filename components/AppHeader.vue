<template>
  <div>
    <b-navbar>
      <b-navbar-brand to="/">秘伝のタレ</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="userSignedIn">
          <b-nav-item>{{ displayName }}</b-nav-item>
          <b-nav-item @click="logout">ログアウト</b-nav-item>
          <b-nav-item to="/notes/new" exact exact-active-class="active"
            >新規ノート作成</b-nav-item
          >
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
// import { mapGetters, mapActions } from 'vuex'
import { usersStore } from '../store' // モジュールクラスをインポート

export default Vue.extend({
  computed: {
    userSignedIn() {
      console.log(usersStore.userSignedIn)
      return usersStore.userSignedIn
    },
    // ...mapGetters('users', ['userSignedIn', 'currentUser']),
  },
  created() {
    this.authStateChanged()
  },
  methods: {
    authStateChanged() {
      usersStore.authStateChanged()
    },
    login() {
      return usersStore.login()
    },
    logout() {
      return usersStore.logout()
    },
    displayName() {
      return usersStore.userDisplayName
    },
    // ...mapActions('users', ['authStateChanged', 'login', 'logout']),
  },
})
</script>
<style></style>
