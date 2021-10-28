<template>
    <div class='collect-info-dialog' v-if="show"  v-fixed>
         <div class="collect-info" :class="{ 'collect-info-max':collectInfoData.length > 3, 'collect-info-min':collectInfoData.length < 3 }">
            <div class="collect-info-header-bg"></div>
            <div class="collect-info-header">
                <div class="title">
                    <div class="tille-name">用户信息</div>
                </div>
                <div class="collect-info-header-right" @click.stop="onClose">
                  <i class="i-close"></i>
                </div>
            </div>
            <div class="container" :class="{ 'container-max':collectInfoData.length > 3, 'container-min':collectInfoData.length < 3  }" >
                <p class="tips">请务必填写以下信息，奖品才能送到您手中</p>
                <van-form
                    @submit="onSubmit"
                    @failed="onFailed"
                    :show-error="false"
                    :show-error-message="false"
                    :validate-first="true"
                    class="form" :class="{ 'form-max':collectInfoData.length > 3,'form-min':collectInfoData.length < 3  }">
                    <div v-for="(item, index) in collectInfoData" :key="index" class="form-item" >
                        <div v-if="item.unique_name === 'gender'">
                            <van-field
                                v-model="item.value"
                                class="form-input"
                                :placeholder="item.name"
                                :maxlength='item.maxlength'
                                readonly
                                is-link
                                @focus="isGenderShow = true">
                            </van-field>
                            <van-action-sheet v-model="isGenderShow" style="height:auto" :get-container="getContainer"   :actions="gender" @select="onGenderSelect" />
                        </div>
                        <div v-else-if="item.name === '下拉选择器'">
                            <van-field
                                v-model="item.value[0]"
                                class="form-input"
                                :placeholder="item.name"
                                :maxlength='item.maxlength'
                                is-link
                                @focus="isSelectShow = true"
                                readonly>
                            </van-field>
                            <van-action-sheet v-model="isSelectShow" style="height:auto" :get-container="getContainer"  :actions="select" @select="onSelect" />
                        </div>
                        <div v-else-if="item.unique_name === 'department'">
                            <van-field
                                v-model="item.value[0]"
                                class="form-input"
                                :placeholder="item.name"
                                :maxlength='item.maxlength'
                                is-link
                                @focus="isDepartmentShow = true"
                                readonly
                            >
                            </van-field>
                            <van-action-sheet v-model="isDepartmentShow" style="height:auto" :get-container="getContainer"   :actions="department" @select="onDepartmentSelect" />
                        </div>
                        <div v-else-if="item.unique_name === 'birthday'">
                            <van-field
                                v-model="item.value"
                                class="form-input"
                                :placeholder="item.name"
                                :maxlength='item.maxlength'
                                is-link
                                readonly
                                @focus="isBirthdayShow = true"
                            >
                            </van-field>
                            <van-popup v-model="isBirthdayShow" style="background:#fff" :get-container="getContainer"  position="bottom" :style="{ height: '40%' }">
                                <van-datetime-picker
                                  class="picker-date"
                                  v-model="currentDate"
                                  type="date"
                                  title='选择生日'
                                  :min-date='minDate'
                                  @change='onBirthChange'
                                  :formatter="formatter"
                                  @confirm="onConfirm"
                                  @cancel='isBirthdayShow=false'
                                />
                            </van-popup>
                            <!-- <van-calendar v-model="isBirthdayShow" @confirm="onConfirm" :min-date='minDate'/> -->
                        </div>
                        <div v-else-if="item.unique_name === 'address'">
                            <van-field
                                v-model="item.value"
                                class="address"
                                :placeholder="item.name"
                                :maxlength='item.maxlength'
                                type='textarea'
                                show-word-limit
                                autosize
                            />
                        </div>
                        <div v-else-if="item.unique_name === 'mobile'">
                            <van-field
                                v-model="item.value"
                                class="form-input"
                                :placeholder="item.name"
                                :maxlength='item.maxlength'
                                type='tel'
                            />
                        </div>
                        <div v-else-if="item.unique_name !== 'gender' || item.unique_name !== 'textarea' || item.unique_name !== 'department' ||
                            item.unique_name !== 'address' || item.name !== '下拉选择器'  || item.unique_name !== 'birthday' || item.unique_name !== 'mobile' ">
                            <van-field
                            v-model="item.value"
                            class="form-input"
                            :placeholder="item.name"
                            :maxlength='item.maxlength'
                            />
                        </div>
                    </div>
                    <div class="form-sub">
                        <van-button round block  native-type="submit" :loading='loading' class="form-btn">确认</van-button>
                    </div>
                </van-form>
            </div>
            <div class="collect-info-footer"></div>
         </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { formatDate } from '@/utils/utils'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
const idCardNoUtil = {
  /* 省,直辖市代码表 */
  provinceAndCitys: {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外'
  },
  /* 每位加权因子 */
  powers: ['7', '9', '10', '5', '8', '4', '2', '1', '6', '3', '7', '9', '10', '5', '8', '4', '2'],
  /* 第18位校检码 */
  parityBit: ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'],
  /* 性别 */
  genders: {male: 'M', female: 'F'},
  /* 校验地址码 */
  checkAddressCode (addressCode) {
    var check = /^[1-9]\d{5}$/.test(addressCode)
    if (!check) return false
    if (idCardNoUtil.provinceAndCitys[parseInt(addressCode.substring(0, 2))]) {
      return true
    } else {
      return false
    }
  },
  /* 校验日期码 */
  checkBirthDayCode (birDayCode) {
    var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(birDayCode)
    if (!check) return false
    var yyyy = parseInt(birDayCode.substring(0, 4), 10)
    var mm = parseInt(birDayCode.substring(4, 6), 10)
    var dd = parseInt(birDayCode.substring(6), 10)
    var xdata = new Date(yyyy, mm - 1, dd)
    if (xdata > new Date()) {
      return false // 生日不能大于当前日期
    } else if ((xdata.getFullYear() === yyyy) && (xdata.getMonth() === mm - 1) && (xdata.getDate() === dd)) {
      return true
    } else {
      return false
    }
  },
  /* 计算校检码 */
  getParityBit (idCardNo) {
    var id17 = idCardNo.substring(0, 17)
    /* 加权 */
    var power = 0
    for (var i = 0; i < 17; i++) {
      power += parseInt(id17.charAt(i), 10) * parseInt(idCardNoUtil.powers[i])
    }
    /* 取模 */
    var mod = power % 11
    return idCardNoUtil.parityBit[mod]
  },
  /* 验证校检码 */
  checkParityBit (idCardNo) {
    var parityBit = idCardNo.charAt(17).toUpperCase()
    if (idCardNoUtil.getParityBit(idCardNo) === parityBit) {
      return true
    } else {
      return false
    }
  },
  /* 校验15位或18位的身份证号码 */
  checkIdCardNo (idCardNo) {
    // 15位和18位身份证号码的基本校验
    var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo)
    if (!check) return false
    // 判断长度为15位或18位
    if (idCardNo.length === 15) {
      return idCardNoUtil.check15IdCardNo(idCardNo)
    } else if (idCardNo.length === 18) {
      return idCardNoUtil.check18IdCardNo(idCardNo)
    } else {
      return false
    }
  },
  // 校验15位的身份证号码
  check15IdCardNo (idCardNo) {
    // 15位身份证号码的基本校验
    var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo)
    if (!check) return false
    // 校验地址码
    var addressCode = idCardNo.substring(0, 6)
    check = idCardNoUtil.checkAddressCode(addressCode)
    if (!check) return false
    var birDayCode = '19' + idCardNo.substring(6, 12)
    // 校验日期码
    check = idCardNoUtil.checkBirthDayCode(birDayCode)
    if (!check) return false
    // 验证校检码
    return idCardNoUtil.checkParityBit(idCardNo)
  },
  // 校验18位的身份证号码
  check18IdCardNo (idCardNo) {
    // 18位身份证号码的基本格式校验
    var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo)
    if (!check) return false
    // 校验地址码
    var addressCode = idCardNo.substring(0, 6)
    check = idCardNoUtil.checkAddressCode(addressCode)
    if (!check) return false
    // 校验日期码
    var birDayCode = idCardNo.substring(6, 14)
    check = idCardNoUtil.checkBirthDayCode(birDayCode)
    if (!check) return false
    // 验证校检码
    return idCardNoUtil.checkParityBit(idCardNo)
  },
  formateDateCN (day) {
    var yyyy = day.substring(0, 4)
    var mm = day.substring(4, 6)
    var dd = day.substring(6)
    return yyyy + '-' + mm + '-' + dd
  },
  // 获取信息
  getIdCardInfo (idCardNo) {
    var idCardInfo = {
      gender: '', // 性别
      birthday: '' // 出生日期(yyyy-mm-dd)
    }
    if (idCardNo.length === 15) {
      var aday = '19' + idCardNo.substring(6, 12)
      idCardInfo.birthday = idCardNoUtil.formateDateCN(aday)
      if (parseInt(idCardNo.charAt(14)) % 2 === 0) {
        idCardInfo.gender = idCardNoUtil.genders.female
      } else {
        idCardInfo.gender = idCardNoUtil.genders.male
      }
    } else if (idCardNo.length === 18) {
      let aday = idCardNo.substring(6, 14)
      idCardInfo.birthday = idCardNoUtil.formateDateCN(aday)
      if (parseInt(idCardNo.charAt(16)) % 2 === 0) {
        idCardInfo.gender = idCardNoUtil.genders.female
      } else {
        idCardInfo.gender = idCardNoUtil.genders.male
      }
    }
    return idCardInfo
  },
  /* 18位转15位 */
  getId15 (idCardNo) {
    if (idCardNo.length === 15) {
      return idCardNo
    } else if (idCardNo.length === 18) {
      return idCardNo.substring(0, 6) + idCardNo.substring(8, 17)
    } else {
      return null
    }
  },
  /* 15位转18位 */
  getId18 (idCardNo) {
    if (idCardNo.length === 15) {
      var id17 = idCardNo.substring(0, 6) + '19' + idCardNo.substring(6)
      var parityBit = idCardNoUtil.getParityBit(id17)
      return id17 + parityBit
    } else if (idCardNo.length === 18) {
      return idCardNo
    } else {
      return null
    }
  }
}
export default {
  name: '',
  components: {
  },
  props: {
    show: {type: Boolean, require: true},
    activityId: {
      type: [String, Number],
      require: true
    },
    collectInfo: {
      type: [Object, Array],
      require: true
    }
  },
  data () {
    return {
      isGenderShow: false, // 控制性别弹框
      gender: [ // 性别类别数组
        { name: '男', className: 'action' },
        { name: '女', className: 'action' }
      ],
      isSelectShow: false, // 控制下拉选择器弹框
      select: [], // 下拉选择器类型数据
      isDepartmentShow: false, // 控制部门弹框
      department: [], // 部门类型数据
      isBirthdayShow: false, // 控制生日弹框
      minDate: new Date(1900, 0, 1), // 最小时间
      currentDate: new Date(), // 当前时间
      action: 'action',
      loading: false // 提交按钮loading
    }
  },
  computed: {
    collectInfoData: {
      get () {
        return this.collectInfo
      },
      set (val) {
        console.log('rule page数据改变')
        this.$emit('update:data', val)
      }
    }
  },
  watch: {
    show (newState) {
      console.log(newState, 'newState')
      // 更改当前是否显示遮罩的状态
      this.setIsModelShow(newState)
    }
  },
  created () {
  },
  mounted () {
    this.collectInfoData.map(item => {
      if (item.name === '下拉选择器') {
        item.value[0] = ''
        let arr = item.value.slice(1, item.value.length)
        arr.map(scope => {
          scope.name = scope.values
          scope.className = this.action
        })
        this.select = arr
      }
      if (item.unique_name === 'department') {
        item.value[0] = ''
        let arr = item.value.slice(1, item.value.length)
        arr.map(scope => {
          scope.name = scope.values
          scope.className = this.action
        })
        this.department = arr
        console.log(this.department, 'this.department')
      }
      if (item.unique_name === 'birthday') {
        if (item.value) {
          let date = formatDate(item.value, 'YYYY/MM/DD')
          date = date.split('/')
          this.currentDate = new Date(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]))
        }
      }
    })
  },
  directives: {
    fixed: {
      // inserted 被绑定元素插入父节点时调用
      inserted () {
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
        document.body.style.cssText += 'position:fixed;width:100%;top:-' + scrollTop + 'px;'
      },
      // unbind 指令与元素解绑时调用
      unbind () {
        let body = document.body
        body.style.position = ''
        let top = body.style.top
        document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top)
        body.style.top = ''
      }
    }
  },
  methods: {
    onClose () {
      this.$emit('close', false)
    },
    ...mapMutations('lottery', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    }),
    // 表单提交
    async onSubmit (values) {
      this.loading = false
      try {
        let data = {}
        let flag = true
        for (let item of this.collectInfoData) {
          let key = item.unique_name
          let temp = this.collectInfoData[key]
          let value = item.value
          let name = item.name
          if (!value) {
            if (key === 'name') {
              this.$toast('请填写' + item.name)
              flag = false
              break
            } else if (key === 'mobile') {
              this.$toast('请填写' + item.name)
              flag = false
              break
            } else if (key === 'id_card') {
              this.$toast('请填写' + item.name)
              flag = false
              break
            } else if (key === 'address') {
              this.$toast('请填写' + item.name)
              flag = false
              break
            } else if (key === 'gender') {
              this.$toast('请选择' + item.name)
              flag = false
              break
            } else if (key === 'birthday') {
              this.$toast('请选择' + item.name)
              flag = false
              break
            } else if (name === '自定义') {
              this.$toast('请填写' + item.name)
              flag = false
              break
            } else if (name === '下拉选择器') {
              this.$toast('请选择下拉内容')
              flag = false
              break
            } else if (key === 'department') {
              this.$toast('请选择' + item.name)
              flag = false
              break
            } else if (key === 'work_number') {
              this.$toast('请填写' + item.name)
              flag = false
              break
            }
          }
          if (value) {
            if (value instanceof Array) {
              value = value[0]
            }
            temp = key
            data[key] = value
          }
          console.log(temp)
          if (key === 'mobile') {
            let result = this.checkMobile(value)
            if (!result) {
              this.$toast(item.name + '格式错误')
              flag = false
              break
            }
          } else if (key === 'id_card') {
            let result = idCardNoUtil.checkIdCardNo(value)
            if (!result) {
              this.$toast(item.name + '格式错误')
              flag = false
              break
            }
          }
        }
        if (!flag) {
          return
        }
        console.log(data)
        this.loading = true
        const res = await API.getCollection({
          query: { id: this.activityId },
          data
        })
        if (res.success === 1) {
          this.$toast.success('保存成功')
          // this.$emit('update:collectInfo')
          STORAGE.set('lotteryFirst', 1)
          this.$parent.ininData()
          this.onClose()
        }
        this.loading = false
        // console.log(res)
      } catch (error) {
        this.loading = false
      }
    },
    // 表单验证方法
    onFailed (error) {
      console.log('验证失败', error)
      this.$toast({
        message: error.errors[0].message
      })
    },
    // 性别选择
    onGenderSelect (value) {
      this.isGenderShow = false
      this.collectInfoData.map(item => {
        if (item.unique_name === 'gender') {
          item.value = value.name
        }
      })
      console.log(value, 'value')
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      // this.show = false
      // Toast(item.name)
    },
    // 下拉选择
    onSelect (value) {
      // console.log(value, 'value')
      this.isSelectShow = false
      this.collectInfoData.map(item => {
        if (item.name === '下拉选择器') {
          item.value[0] = value.name
        }
      })
    },
    // 部门选择
    onDepartmentSelect (value) {
      this.isDepartmentShow = false
      this.collectInfoData.map(item => {
        if (item.unique_name === 'department') {
          item.value[0] = value.name
        }
      })
    },
    // 生日选择
    onBirthChange (val) {
      this.collectInfoData.map(item => {
        if (item.unique_name === 'birthday') {
          // item.value = val
          item.value = formatDate(this.currentDate, 'YYYY-MM-DD')
        }
      })
    },
    // 生日日期格式化
    formatter (type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      } else if (type === 'day') {
        return `${val}日`
      }
      return val
    },
    // 生日确认
    onConfirm (val) {
      let year = val.getFullYear()
      let month = val.getMonth() + 1
      let day = val.getDate()
      if (month >= 1 && month <= 9) { month = `0${month}` }
      if (day >= 1 && day <= 9) { day = `0${day}` }
      this.currentDate = `${year}-${month}-${day}`
      this.isBirthdayShow = false
      this.collectInfoData.map(item => {
        if (item.unique_name === 'birthday') {
          item.value = this.currentDate
        }
      })
    },
    // 手机校验
    checkMobile (val) {
      let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (!reg.test(val)) {
        return false
      } else {
        return true
      }
    },
    getContainer () {
      return document.querySelector('.collect-info-dialog')
    }
  }
}
</script>
<style lang="scss">
.collect-info-dialog{
  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    color: rgba(79, 15, 15, .3);
  }
  input:-moz-placeholder, textarea:-moz-placeholder {
    color: rgba(79, 15, 15, .3);
  }
  input::-moz-placeholder, textarea::-moz-placeholder {
    color: rgba(79, 15, 15, .3);
  }
  input:-ms-input-placeholder, textarea:-ms-input-placeholder {
    color: rgba(79, 15, 15, .3);
  }
}
</style>
<style scoped lang="scss">
@import "@/styles/index.scss";
.collect-info-dialog{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // pointer-events: auto;
  // &.lock{
  //   pointer-events: none;
  // }
  .collect-info{
    width: px2rem(600px);
    // height: px2rem(580px);
    height: px2rem(780px);
    background: #fff9ec;
    border-radius: px2rem(16px);
    position: relative;
    box-sizing: border-box;
    // pointer-events: auto;
    &.collect-info-max {
      height: px2rem(880px);
    }
    &.collect-info-min {
      height: px2rem(580px);
    }
    .collect-info-header-bg{
      width:100%;
      height: px2rem(192px);
      @include img-retina("~@/assets/lottery/activityRule/propup3.png",
      "~@/assets/lottery/activityRule/propup3@2x.png", 100%, 100%);
      background-repeat: no-repeat;
      background-position: top;
      position: absolute;
      top: 0;
      left: 0;
    }
    .collect-info-header{
      width:100%;
      height: px2rem(68px);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      .title{
        width: px2rem(297px);
        height:px2rem(68px);
        margin-left: px2rem(152px);
        margin-top: px2rem(-8px);
        // margin-right: auto;
        @include img-retina("~@/assets/lottery/activityRule/title.png",
        "~@/assets/lottery/activityRule/title@2x.png", 100%, 100%);
        background-repeat: no-repeat;
        display: flex;
        justify-content: center;
        z-index: 10px;
        float: left;
        .tille-name{
            height: px2rem(36px);
            opacity: 1;
            font-size: px2rem(36px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: center;
            color: #fff4e3 !important;
            line-height: px2rem(68px);
        }
      }
      .collect-info-header-right{
        width: px2rem(50px);
        height: px2rem(50px);
        padding-right: px2rem(30px);
        padding-top: px2rem(30px);
        float: right;
        cursor: pointer;
        .i-close{
          display: inline-block;
          width: px2rem(20px);
          height: px2rem(20px);
              @include img-retina("~@/assets/lottery/icon-close.png",
          "~@/assets/lottery/icon-close@2x.png", 100%, 100%);
          background-repeat: no-repeat;
        }
      }
    }
    .container{
      width: 100%;
    //   height: px2rem(482px);
      // height: px2rem(512px);
      height: px2rem(712px);
      position: absolute;
      top: px2rem(68px);
      z-index: 10;
      padding-top: px2rem(50px);
      padding-left: px2rem(40px);
      padding-right: px2rem(40px);
      &.container-max{
        height: px2rem(812px);
      }
      &.container-min{
        height: px2rem(512px);
      }
      .tips{
        height: px2rem(24px);
        opacity: 0.8;
        font-size: px2rem(24px);
        font-family: SourceHanSansCN, SourceHanSansCN-Regular;
        font-weight: 400;
        text-align: left;
        color: #4f0f0f;
        line-height: px2rem(24px);
      }
      .form{
        margin-top:px2rem(30px);
        height: px2rem(566px);
        overflow-y: scroll;
        &.form-max{
          height: px2rem(666px);
        }
        &.form-min{
          height: px2rem(366px);
        }
        .form-input{
          width: px2rem(520px);
          height: px2rem(90px);
          opacity: 1;
          background: #f8efdc;
          border-radius: px2rem(8px);
          margin-bottom:px2rem(30px);
          display: flex;
          align-items: center;
          padding:  0 px2rem(20px);
          /deep/ .van-field__control{
              height: px2rem(40px);
              // opacity: 0.3;
              font-size: px2rem(28px);
              font-family: PingFangSC, PingFangSC-Regular;
              font-weight: 400;
              text-align: left;
              color: #4f0f0f;
              line-height: px2rem(40px);
          }
        }
        .form-textarea{
            width: px2rem(520px);
            height: px2rem(140px);
            opacity: 1;
            background: #f8efdc;
            border-radius: px2rem(8px);
            padding:  0 px2rem(30px);
            overflow-y: auto;
            margin-bottom:px2rem(60px);
        }
        .form-sub {
          overflow: hidden;
          margin-top: px2rem(60px);
        }
        .form-btn{
          width: px2rem(300px);
          height: px2rem(80px);
          opacity: 1;
          border: none;
          background: linear-gradient(0deg,#ffdaa3 1%, #ffebc5);
          border-radius: px2rem(16px);
        //   margin: px2rem(60px) auto;
          margin-left: auto;
          margin-right: auto;
          box-shadow: 0 px2rem(8px) 0px 0px #e5b56b;
          font-size: px2rem(28px);
          font-family: SourceHanSansCN, SourceHanSansCN-Medium;
          font-weight: 500;
          text-align: left;
          color: #4f0f0f;
          margin-bottom: px2rem(8px);
        }
        /deep/ .address {
            padding:  0 px2rem(30px);
            background: #f8efdc;
            border-radius: px2rem(8px);
            margin-bottom:px2rem(30px);
            /deep/ .van-field__word-limit {
                margin-bottom: px2rem(8px);
            }
        }
      }
    }
    .collect-info-footer{
      width: px2rem(600px);
      height: px2rem(140px);
      border-bottom-left-radius: px2rem(16px);
      border-bottom-right-radius: px2rem(16px);
      opacity: 1;
      @include img-retina("~@/assets/lottery/activityRule/propup4.png","~@/assets/lottery/activityRule/propup4.png", 100%, 100%);
      background-position: bottom;
      background-repeat: no-repeat;
      background-color:#fff9ec;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
}
.action {
  height: px2rem(100px);
  line-height: px2rem(100px);
}
</style>
