<template functional>
  <span>
    {{ props.datetime | formatTime }}
  </span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { format } from 'date-fns'
@Component({
  filters: {
    formatTime(value: Date): string {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      return value && value > yesterday
        ? format(value, 'HH:mm')
        : format(value, 'yyyy/MM/dd HH:mm')
    },
  },
})
class TimeLabel extends Vue {
  @Prop()
  datetime!: Date
}
export default TimeLabel
</script>
