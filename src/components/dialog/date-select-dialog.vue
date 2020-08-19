<template>
  <mt-datetime-picker
    class="date-select-wrap"
    ref="picker"
    type="date"
    :startDate="startDate"
    :endDate="endDate"
    year-format="{value}年"
    month-format="{value}月"
    date-format="{value}日"
    confirmText="完成"
    :closeOnClickModal="false"
    :visibleItemCount="5"
    @confirm="success"
    v-model="dateVal"
    @touchmove.native.stop.prevent>
  </mt-datetime-picker>
</template>

<script>
import { DatetimePicker } from 'mint-ui'
import { formatDate } from '@/utils/utils'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    valueKey: {
      type: String,
      default: ''
    },
    selectData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.openPicker(val)
      }
    }
  },
  components: {
    DatetimePicker
  },
  data () {
    return {
      startDate: new Date('1920-01-01'),
      endDate: new Date(),
      dateVal: formatDate(new Date(), 'YYYY-MM-DD')
    }
  },
  methods: {
    openPicker (val) {
      this.$refs.picker.open()
    },
    success () {
      let date = this.dateVal
      if (date) {
        date = formatDate(date, 'YYYY-MM-DD')
      }
      this.$emit('success', date)
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .date-select-wrap {
    .picker-toolbar {
      height: px2rem(80px);
      line-height: px2rem(80px);
    }
    .mint-datetime-action {
      text-align: right;
      color: #666;
      padding-right: px2rem(30px);
    }
    .mint-datetime-cancel {
      display: none;
    }
  }
</style>
