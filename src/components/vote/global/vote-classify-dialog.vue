<template>
  <mt-popup
    class="vote-classify-dialog"
     v-model="selectShow"
    popup-transition="popup-fade"
    :closeOnClickModal="false"
    @touchmove.native.stop.prevent
    position="bottom">
    <div class="picker-toolbar">
      <div class="usi-btn-sure" @click.stop="success()">确定</div>
    </div>
    <div class="picker-flex">
      <mt-picker :slots="selectData" :valueKey="valueKey" @change="onValuesChange" :visibleItemCount="5"></mt-picker>
      <mt-picker :slots="selectData2" :valueKey="valueKey" @change="onValuesChange2" :visibleItemCount="5"></mt-picker>
    </div>
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
      type: Object,
      default: () => {
        return {}
      }
    },
    classifyData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.initClassifyData()
        this.initData()
      } else {
        this.selectShow = []
      }
      this.selectShow = val
    }
  },
  components: {
    Picker, Popup
  },
  data () {
    return {
      message: '',
      selectShow: false,
      selectData: [], // 显示内容1
      selectData2: [], // 显示内容2
      tmpObj: {}, // key: id, value: 二级分类列表
      valueKey: 'name'
    }
  },
  methods: {
    initData () {
      let classifyData = this.classifyData
      let defaultSelect = this.defaultSelect
      let index = 0
      if (defaultSelect && defaultSelect.id) {
        let { id: defaultId, fid: defaultFid } = defaultSelect
        if (defaultFid === 0) {
          for (let i = 0; i < classifyData.length; i++) {
            if (classifyData[i].id === defaultId) {
              index = i
              break
            }
          }
        } else {
          for (let i = 0; i < classifyData.length; i++) {
            if (classifyData[i].id === defaultFid) {
              index = i
              break
            }
          }
        }
      }
      this.selectData = [{
        flex: 1,
        values: classifyData,
        defaultIndex: index
      }]
      // 渲染二级分类
      this.getClassify2Data(defaultSelect)
    },
    initClassifyData () {
      let classifyData = this.classifyData
      let tmpObj = {}
      for (let i = 0; i < classifyData.length; i++) {
        let item = classifyData[i]
        tmpObj[item.id] = item.child
      }
      this.tmpObj = tmpObj
    },
    getClassify2Data (item) {
      let tmpObj = this.tmpObj
      let defaultSelect = this.defaultSelect
      let index = 0
      let classify2 = []
      if (item.fid === 0 && tmpObj[item.id]) {
        classify2 = [{ id: item.id, name: ' ' }, ...tmpObj[item.id]]
      } else if (item.fid !== 0 && tmpObj[item.fid]) {
        classify2 = [{ id: item.fid, name: ' ' }, ...tmpObj[item.fid]]
      }
      for (let i = 0; i < classify2.length; i++) {
        if (classify2[i].id === defaultSelect.id) {
          index = i
          break
        }
      }
      let selectData2 = [{
        flex: 1,
        values: classify2,
        defaultIndex: index
      }]
      this.selectData2 = selectData2
    },
    onValuesChange (picker, values) {
      if (values && values.length && values[0]) {
        let item = values[0]
        this.message = item
        this.getClassify2Data(item)
      }
    },
    onValuesChange2 (picker, values) {
      if (values && values.length && values[0]) {
        let item = values[0]
        if (item.id && item.name.trim() === '') {
          let classifyData = this.classifyData
          let tmpObj = {}
          for (let i = 0; i < classifyData.length; i++) {
            if (classifyData[i].id === item.id) {
              tmpObj = classifyData[i]
              break
            }
          }
          this.message = tmpObj
        } else {
          this.message = values[0]
        }
      }
    },
    success () {
      let message = this.message
      if (!message || !message.name) {
        message = this.defaultSelect
      }
      console.log('success', message)
      this.$emit('success', message)
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .vote-classify-dialog {
    &.mint-popup-bottom {
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
    .picker-flex {
      display: flex;
      padding: px2rem(20px) 0;
      .picker {
        flex: 1;
      }
    }
  }
</style>
