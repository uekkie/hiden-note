<template>
  <div>
    <b-navbar>
      <b-navbar-brand to="/">秘伝のタレ</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="userSignedIn">
          <b-nav-item>{{ userData.displayName }}</b-nav-item>
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
import { mapMutations } from 'vuex'
import { firebase } from '~/plugins/firebase'
export default Vue.extend({
  computed: {
    userSignedIn() {
      return this.$store.getters.userSignedIn
    },
    userData() {
      return {
        uid: this.$store.getters.userUid,
        email: this.$store.getters.userEmail,
        displayName: this.$store.getters.userDisplayName,
      }
    },
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.clearCurrentUser()
        return
      }
      const { uid, email, displayName } = user
      this.setCurrentUser({ uid, email, displayName })
    })
  },
  methods: {
    login() {
      this.$store.dispatch('login')
    },
    logout() {
      this.$store.dispatch('logout')
    },
    ...mapMutations([
      // `this.setCurrentUser(user)` を `this.$store.commit('setCurrentUser', user)` にマッピングする
      'setCurrentUser',
      // `this.clearCurrentUser()` を `this.$store.commit('clearCurrentUser')` にマッピングする
      'clearCurrentUser',
    ]),
  },
})
</script>
<style></style>
