<template>
  <mt-popup v-model="selectShow"
    popup-transition="popup-fade"
    :closeOnClickModal="false"
    position="bottom">
    <div class="city-wrap">
      <div class="city-tool-bar" @click.stop="success()">完成</div>
      <v-distpicker type="mobile"
        @province="onProvince"
        @city="onCity"
        @area="onArea">
      </v-distpicker>
    </div>
  </mt-popup>
</template>

<script>
import { Picker, Popup } from 'mint-ui'
import VDistpicker from 'v-distpicker'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show (val) {
      this.selectShow = val
    }
  },
  components: {
    Picker, Popup, VDistpicker
  },
  data () {
    return {
      selectData: [],
      message: '',
      selectShow: false
    }
  },
  methods: {
    onProvince (data) {
      this.selectData = []
      this.selectData.push(data.value)
    },
    onCity (data) {
      let selectData = this.selectData
      if (selectData && selectData.length >= 1) {
        let newData = [selectData[0]]
        if (data.code) {
          newData.push(data.value)
        }
        this.selectData = newData
      }
    },
    onArea (data) {
      let selectData = this.selectData
      if (selectData && selectData.length >= 2) {
        let newData = [selectData[0], selectData[1]]
        if (data.code) {
          newData.push(data.value)
        }
        this.selectData = newData
      }
    },
    success () {
      let selectData = this.selectData
      if (!selectData) {
        selectData = this.valueKey
      }
      this.$emit('success', selectData.join(' '))
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .city-wrap {
    .city-tool-bar {
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
    .distpicker-address-wrapper .address-container ul {
      height: px2rem(380px);
    }
  }
  .mint-popup-bottom {
    width: 100%;
  }
</style>
