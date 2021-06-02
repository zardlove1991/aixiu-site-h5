<template>
  <mt-popup v-model="selectShow"
    popup-transition="popup-fade"
    :closeOnClickModal="false"
    @touchmove.native.stop.prevent
    position="bottom">
    <mt-picker :slots="selectData"
      @change="onValuesChange"
      :visibleItemCount="5"
      showToolbar>
      <div class="usi-btn-sure" @click.stop="success()">确定</div>
    </mt-picker>
  </mt-popup>
</template>

<script>
import { Picker, Popup } from 'mint-ui'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    defaultSelect: {
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
      this.selectShow = val
      if (!val) {
        this.message = ''
      }
    }
  },
  components: {
    Picker, Popup
  },
  data () {
    return {
      message: '',
      selectShow: false
    }
  },
  methods: {
    onValuesChange (picker, values) {
      this.message = values[0]
    },
    success () {
      let message = this.message
      if (!message) {
        message = this.defaultSelect
      } else {
        this.$emit('update:defaultSelect', message)
      }
      this.$emit('success', message)
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .mint-popup-bottom {
    width: 100%;
  }
  .usi-btn-sure {
    box-sizing: border-box;
    padding-right: px2rem(30px);
    width: 100%;
    height: px2rem(80px);
    line-height: px2rem(80px);
    text-align: right;
    font-size: px2rem(30px);
    color: #666;
    border-bottom: px2rem(1px) solid #eaeaea;
  }
</style>
