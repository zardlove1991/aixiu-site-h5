<template>
  <div :class="['collection-dialog-wrap', isScroll]" v-if="show">
    <div class="check-dialog-content">
      <div :class="['check-dialog-main', themeColorName]">
        <div class="check-header">填写预约信息</div>
        <div class="date-wrap">
          <i :class="['collection-date-icon', themeColorName]"></i><span class="check-msg">{{setting.show_date}} {{setting.week}} {{setting.show_time}}</span>
        </div>
        <div class="check-item" v-for="(item, index) in checkDraw" :key="index">
          <el-input
            :placeholder="item.name"
            :type="item.type"
            :maxlength="item.maxlength"
            :readonly="item.unique_name === 'gender' || item.unique_name === 'birthday' || item.unique_name === 'address' || item.type === 'select'"
            @focus="focusAction(item)"
            @blur="blurAction()"
            v-model="checkData[item.unique_name]"></el-input>
          <div v-show="item.unique_name === 'gender' || item.unique_name === 'birthday' || item.unique_name === 'address' || item.type === 'select'" class="drop-icon"></div>
        </div>
        <div class="submit-btn-wrap disabled" v-if="loading">确认</div>
        <div class="submit-btn-wrap active" v-else @click.stop="sureCheckDraw()">确认</div>
        <div class="close-btn" @click.stop="closeCheckDraw()"></div>
      </div>
    </div>
    <select-dialog
      :show="isShowSelect"
      :defaultSelect="defaultSelect"
      :selectData="selectData"
      @close="isShowSelect = false"
      @success="selectSuccessAction">
    </select-dialog>
    <date-select-dialog
      :show="isShowDateSelect"
      @close="isShowDateSelect = false"
      @success="selectSuccessAction">
    </date-select-dialog>
    <city-select-dialog
      :show="isShowCitySelect"
      @close="isShowCitySelect = false"
      @success="selectSuccessAction">
    </city-select-dialog>
    <component
      :show="customShow"
      :defaultSelect="customData.default_select"
      :selectData="customData.select_data"
      @close="customShow = false"
      @success="selectSuccessAction"
      :is="'select-dialog'">
    </component>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import API from '@/api/module/examination'
import { Toast } from 'mint-ui'
import SelectDialog from '@/components/dialog/select-dialog'
import DateSelectDialog from '@/components/dialog/date-select-dialog'
import CitySelectDialog from '@/components/dialog/city-select-dialog'

export default {
  props: {
    id: String,
    show: {
      type: Boolean,
      default: false
    },
    checkDraw: {
      type: Array,
      default: () => {
        return []
      }
    },
    setting: {
      type: Object,
      default: () => {
        return {}
      }
    },
    themeColorName: {
      type: String,
      default: 'orderblue'
    }
  },
  components: {
    SelectDialog, DateSelectDialog, CitySelectDialog
  },
  computed: {
    isScroll () {
      if (this.isShowSelect || this.isShowDateSelect || this.isShowCitySelect) {
        return 'is-noscroll'
      }
      return ''
    }
  },
  watch: {
    show (newState) {
      if (!newState) {
        this.checkData = {}
      }
      // 更改当前是否显示遮罩的状态
      this.setModelThumbState(newState)
    }
  },
  data () {
    return {
      loading: false,
      checkData: {}, // 输入的表单内容
      isShowSelect: false, // 性别
      isShowDateSelect: false, // 日期选择器
      isShowCitySelect: false,
      selectData: [],
      defaultSelect: '',
      focusKey: '',
      customShow: false,
      customData: {} // 当前下拉选的对象
    }
  },
  methods: {
    focusAction (item) {
      let key = item.unique_name
      let type = item.type
      this.focusKey = key
      if (key === 'gender') {
        this.isShowSelect = true
        this.defaultSelect = '男'
        this.selectData = [{
          flex: 1,
          values: ['男', '女'],
          className: 'gender-select',
          defaultIndex: 0
        }]
      } else if (key === 'birthday') {
        this.isShowDateSelect = true
      } else if (key === 'address') {
        this.isShowCitySelect = true
      }
      if (type === 'select') {
        let value = this.checkData[item.unique_name]
        if (value) {
          let values = item.select_data
          if (values && values.length) {
            let arr = values[0]
            let arr2 = arr.values
            let index = arr2.indexOf(value)
            arr.defaultIndex = index
          }
        }
        this.customShow = true
        this.customData = item
      }
    },
    blurAction () {
      document.body.scrollTop = 0
    },
    selectSuccessAction (val) {
      let key = this.focusKey
      if (key === 'gender') {
        this.checkData.gender = val
        this.isShowSelect = false
      } else if (key === 'birthday') {
        this.checkData.birthday = val
        this.isShowDateSelect = false
      } else if (key === 'address') {
        this.checkData.address = val
        this.isShowCitySelect = false
      }
      if (this.customShow) {
        this.customShow = false
        if (this.customData && this.customData.unique_name) {
          this.checkData[this.customData.unique_name] = val
          this.customData = {}
        }
      }
    },
    closeCheckDraw () {
      this.$emit('close')
    },
    sureCheckDraw () {
      let checkData = this.checkData
      let checkDraw = this.checkDraw
      let flag = true
      for (let item of checkDraw) {
        let key = item.unique_name
        let val = checkData[key]
        if (!val) {
          Toast('请输入' + item.name)
          flag = false
          break
        }
      }
      if (!flag) {
        return
      }
      this.loading = true
      let data = this.getSubmitData()
      API.saveEnrollInfo({
        data
      }).then(res => {
        if (res.error_code) {
          this.loading = false
          Toast(res.error_message)
          return
        }
        let data = {
          ...res,
          num: this.setting.show_date + ' ' + this.setting.show_time
        }
        this.loading = false
        this.$emit('close')
        this.$emit('success', data)
      })
    },
    getSubmitData () {
      let checkData = { ...this.checkData }
      let checkDraw = this.checkDraw
      let collectNumberInfo = []
      if (checkData.address && checkData.detail_address) {
        checkData.address = checkData.address + ' ' + checkData.detail_address
      }
      for (let item of checkDraw) {
        let key = item.unique_name
        let val = checkData[key]
        if (key === 'detail_address') {
          continue
        }
        collectNumberInfo.push({
          unique_name: key,
          name: item.name,
          value: val
        })
      }
      let result = {
        order_id: this.id,
        sections_id: this.setting.sections_id,
        collect_member_info: collectNumberInfo
      }
      return result
    },
    ...mapMutations('depence', {
      setModelThumbState: 'SET_MODEL_THUMB_STATE'
    })
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .collection-dialog-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    box-sizing: border-box;
    // padding: 30px 0;
    background: rgba(34,34,34,0.50);
    z-index: 99;
    &.is-noscroll {
      overflow: hidden;
    }
    .check-dialog-content {
      max-height: 100vh;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      .check-dialog-main {
        margin: 0 auto;
        width: px2rem(600px);
        border-radius: px2rem(40px);
        padding: px2rem(50px) px2rem(38px) px2rem(72px) px2rem(38px);
        display: flex;
        justify-content: center;
        // align-items: center;
        flex-direction: column;
        position: relative;
        background-color:#fff;
        background-repeat: no-repeat;
        background-position: bottom;
        &.orderblue {
          @include img-retina('~@/assets/enroll/dialog/orderblue-bg@2x.png', '~@/assets/enroll/dialog/orderblue-bg@3x.png', px2rem(600px), px2rem(89px));
        }
        &.ordergreen {
          @include img-retina('~@/assets/enroll/dialog/ordergreen-bg@2x.png', '~@/assets/enroll/dialog/ordergreen-bg@3x.png', px2rem(600px), px2rem(89px));
        }
        &.orderorangered {
          @include img-retina('~@/assets/enroll/dialog/orderorangered-bg@2x.png', '~@/assets/enroll/dialog/orderorangered-bg@3x.png', px2rem(600px), px2rem(89px));
        }
        &.ordergolden {
          @include img-retina('~@/assets/enroll/dialog/ordergolden-bg@2x.png', '~@/assets/enroll/dialog/ordergolden-bg@3x.png', px2rem(600px), px2rem(89px));
        }
        &.orderred {
          @include img-retina('~@/assets/enroll/dialog/orderred-bg@2x.png', '~@/assets/enroll/dialog/orderred-bg@3x.png', px2rem(600px), px2rem(89px));
        }
        &.orderorange {
          @include img-retina('~@/assets/enroll/dialog/orderorange-bg@2x.png', '~@/assets/enroll/dialog/orderorange-bg@3x.png', px2rem(600px), px2rem(89px));
        }
        .check-header {
          text-align: center;
          margin-bottom: px2rem(30px);
          @include font-dpr(18px);
          color: #333333;
          font-weight: bold;
        }
        .date-wrap {
          margin-bottom: px2rem(20px);
          height: px2rem(28px);
          display: flex;
          align-items: center;
          .collection-date-icon {
            display: inline-block;
            width: px2rem(27px);
            height: px2rem(26px);
            background-size: px2rem(27px) px2rem(26px);
            &.orderblue {
              @include img-retina('~@/assets/enroll/date/blue-icon@2x.png', '~@/assets/enroll/date/blue-icon@3x.png', 100%, auto);
            }
            &.ordergreen {
              @include img-retina('~@/assets/enroll/date/green-icon@2x.png', '~@/assets/enroll/date/green-icon@3x.png', 100%, auto);;
            }
            &.orderorangered {
              @include img-retina('~@/assets/enroll/date/orangered-icon@2x.png', '~@/assets/enroll/date/orangered-icon@3x.png', 100%, auto);
            }
            &.ordergolden {
              @include img-retina('~@/assets/enroll/date/golden-icon@2x.png', '~@/assets/enroll/date/golden-icon@3x.png', 100%, auto);
            }
            &.orderred {
              @include img-retina('~@/assets/enroll/date/red-icon@2x.png', '~@/assets/enroll/date/red-icon@3x.png', 100%, auto);
            }
            &.orderorange {
              @include img-retina('~@/assets/enroll/date/orange-icon@2x.png', '~@/assets/enroll/date/orange-icon@3x.png', 100%, auto);
            }
          }
          .check-msg {
            display: inline-block;
            margin-left: px2rem(20px);
            line-height: px2rem(28px);
            @include font-dpr(14px);
            @include font-color('btnColor');
          }
        }
        .check-item {
          width: 100%;
          margin-bottom: px2rem(30px);
          position: relative;
          .el-input__inner, .el-textarea__inner {
            -webkit-appearance: none;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: px2rem(4px);
            padding: px2rem(20px);
            @include font-dpr(14px);
            color: #333;
            border: 1px solid #dadada;
            &::placeholder {
              @include font-dpr(14px);
              color: #999;
            }
          }
          .el-input .el-input__inner {
            height: px2rem(90px);
            line-height: px2rem(90px);
          }
          .el-textarea {
            .el-textarea__inner {
              resize: none;
              height: px2rem(140px);
            }
          }
          .drop-icon {
            position: absolute;
            right: px2rem(28px);
            top: px2rem(35px);
            width: px2rem(30px);
            height: px2rem(16px);
            background-size: px2rem(30px) px2rem(16px);
            @include img-retina("~@/assets/common/dropdown-icon@2x.png","~@/assets/common/dropdown-icon@3x.png", 100%, 100%);
          }
        }
        .submit-btn-wrap {
          width: 100%;
          margin-top: px2rem(44px);
          height: px2rem(80px);
          line-height: px2rem(80px);
          text-align: center;
          border-radius: px2rem(10px);
          // background-color: #FC7465;
          @include font-dpr(14px);
          color: #fff;
          &.disabled {
            background-image: linear-gradient(-90deg, #D4D4D4 0%, #C5C5C5 100%);
            box-shadow: 0 5px 13px 0 rgba(216,216,216,0.48);
          }
          &.active {
            @include bg-linear-color('compColor');
          }
        }
        .close-btn {
          position: absolute;
          z-index: 100;
          right: px2rem(30px);
          top: px2rem(30px);
          width: px2rem(28px);
          height: px2rem(28px);
          @include img-retina("~@/assets/common/close@2x.png","~@/assets/common/close@3x.png", 100%, 100%);
        }
      }
    }
  }
</style>
