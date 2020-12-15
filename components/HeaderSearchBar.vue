<template>
  <b-form class="header__search" @submit.prevent="searchNote">
    <b-icon variant="secondary" icon="search" class="header__search-icon" />
    <b-form-input
      v-model.trim="query"
      class="header__search-keyword"
      type="search"
      autocomplete="off"
      placeholder="キーワードを入力"
      name="q"
      required=""
    />
  </b-form>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
class NoteSearchForm extends Vue {
  private query: string = ''

  searchNote() {
    if (this.query.length > 0) {
      this.$router.push({
        path: '/search',
        query: { q: this.query },
      })
      this.query = ''
    }
  }
}
export default NoteSearchForm
</script>

<style lang="scss" scoped>
.header__search {
  -webkit-tap-highlight-color: transparent;
  font-size: 14px;
  line-height: 1.42857;
  color: #4a4a4a;
  box-sizing: inherit;
  margin: 0;
  position: relative;
  width: 200px;
}
.header__search-icon {
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  position: absolute;
  top: 9px;
  left: 9px;
  color: #aaa;
}
.header__search-keyword {
  margin: 0;
  overflow: visible;
  outline-offset: -2px;
  padding-left: 32px;
  width: 100%;
  height: 32px;
  border: none;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: inset 0 1px 2px #ccc;
  box-sizing: border-box;
  appearance: none;
}
</style>
