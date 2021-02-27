<template>
  <div>
    {{ time }}
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { DateTime } from 'luxon'

type Props = {
  timeStamp: number
}

export default defineComponent({
  props: {
    timeStamp: {
      type: Number,
      require: true,
    },
  },
  setup(props: Props) {
    const ts = props.timeStamp!
    const dt = DateTime.fromMillis(ts)
    const time = dt.toFormat('yyyy-MM-dd HH:mm')
    return {
      time,
    }
  },
})
</script>
<style lang="sass" scoped></style>
