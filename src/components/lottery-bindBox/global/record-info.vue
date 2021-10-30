<template>
<div class='record-info-dialog' v-if="show" v-fixed>
  <div class="record-info-border">
    <div class="record-info">
      <div class="record-info-header">
        <div class="title-bg">
          <div class="title">中奖记录</div>
        </div>
        <div class="close-wrap" @click.stop="onClose">
          <i class="close"></i>
        </div>
      </div>
      <div class="container">
        <!-- <div class="award-name">获得 一等奖趣味手摇音乐盒</div> -->
        <div class="award-name">获得 {{itemData.prize_info.award_name}}{{itemData.prize_info.award_content}}</div>
        <!-- <div class="award-image">
          <img src="https://img01.yzcdn.cn/vant/cat.jpeg" alt="">
        </div> -->
        <div class="award-image" v-if="itemData.prize_info.images">
          <img :src="itemData.prize_info.images" alt="">
        </div>
        <div class="ticked-wrap" v-if="itemData.status_name === '已兑奖'"></div>
        <div class="ticked-wrap ticked-wrap-overdue" v-else-if="itemData.status_name === '已过期'"></div>
         <div class="info-wrap">
            <!-- <p>兑奖码：KM13NJDJNCKK  </p> -->
            <p>兑奖码：{{itemData.prize_info.code}} </p>
            <p>工作人员将在7到15个工作日内联系您</p>
        </div>
         <van-button  block  class="btns" @click="onClose">返回</van-button>
        <div class="content-next-wrap mb10">
            <input type="text" placeholder="姓名" class="label" v-model="itemData.prize_info.address[0]" :readonly='edit' />
            <input type="text" v-model="itemData.prize_info.address[1]" :readonly='edit' class="value" placeholder="手机号" :maxlength="11"/>
        </div>
        <div class="content-next-wrap">
            <van-field type="textarea"  autosize class="address" v-model="itemData.prize_info.address[2]" :readonly='edit' placeholder="详细地址"/>
            <div v-if="edit" class="edit" @click="onEdit">
                <div class="righit-icon"></div>
            </div>
            <div v-else class="edit" @click="onSubmit">
                <div class="righit-icon"></div>
            </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapMutations } from 'vuex'
import API from '@/api/module/examination'
export default {
  name: '',
  components: {
  },
  props: {
    show: {type: Boolean, require: true},
    activityId: {type: String, require: true},
    data: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      edit: true
    }
  },
  computed: {
    itemData: {
      get () {
        return this.data
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
    },
    itemData: {
      handler: function (newValue, oldValue) {
        console.log('%citemData：', 'color: red;font-size:14px;', newValue)
      },
      deep: true,
      immediate: true
    }
  },
  created () {
  },
  mounted () {

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
    onEdit () {
      this.edit = !this.edit
    },
    async onSubmit () {
      let err = ''
      if (!this.itemData.prize_info.address[0]) {
        err = '请填姓名'
      } else if (!this.itemData.prize_info.address[1]) {
        err = '请填写手机号'
      } else if (!this.itemData.prize_info.address[2]) {
        err = '请填写详细地址'
      }
      if (err) {
        this.$toast.fail(err)
        return false
      }
      if (this.itemData.prize_info.address[1]) {
        let res = this.checkMobile(this.itemData.prize_info.address[1])
        if (!res) {
          this.$toast('手机号格式错误')
          return false
        }
      }
      console.log(this.itemData.prize_info)
      const res = await API.getAddress({
        query: { id: this.activityId },
        data: {
          code: this.itemData.prize_info.code,
          name: this.itemData.prize_info.address[0],
          mobile: this.itemData.prize_info.address[1],
          address: this.itemData.prize_info.address[2]
        }
      })
      console.log(res)
      if (res.success === 1) this.$toast.success('编辑成功')
      this.edit = true
    },
    // 手机校验
    checkMobile (val) {
      let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (!reg.test(val)) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>
<style lang="scss">
.record-info-dialog {
    /deep/.address {
        .van-field__control{
            -webkit-user-select: auto !important;
            color: rgba(67, 23, 68, 1);
        }
    }
    input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
      color: rgba(67, 23, 68, .8);
    }
    input:-moz-placeholder, textarea:-moz-placeholder {
      color: rgba(67, 23, 68, .8);
    }
    input::-moz-placeholder, textarea::-moz-placeholder {
      color: rgba(67, 23, 68, .8);
    }
    input:-ms-input-placeholder, textarea:-ms-input-placeholder {
      color: rgba(67, 23, 68, .8);
    }
}
</style>
<style scoped lang="scss">
@import "@/styles/index.scss";
.record-info-dialog{
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
  .record-info-border{
    width: px2rem(620px);
    height: px2rem(790px);
    background: linear-gradient(0deg,rgba(240,123,255,0.00), #a676ff);
    border-radius: px2rem(24px);
    box-shadow: 0px 0px px2rem(14px) 0px rgba(0,0,0,0.10);
    .record-info{
      width: px2rem(600px);
      height: px2rem(770px);
      background: #f6eaf9;
      border-radius: px2rem(20px);
      position: relative;
      box-sizing: border-box;
      margin-top: px2rem(10px);
      margin-left: auto;
      margin-right: auto;
      .record-info-header{
        width: 100%;
        height: px2rem(60px);
        position: relative;
        .title-bg{
          width: px2rem(260px);
          height: px2rem(60px);
          @include img-retina("~@/assets/lottery-bindBox/header-title-bg.png",
          "~@/assets/lottery-bindBox/header-title-bg@2x.png", 100%, 100%);
          background-repeat: no-repeat;
          margin-left: auto;
          margin-right: auto;
          padding: px2rem(6px) px2rem(58px) px2rem(18px) px2rem(58px);
          .title{
            font-size: px2rem(36px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: left;
            color: #ffffff;
          }
        }
        .close-wrap{
          width: px2rem(50px);
          height: px2rem(50px);
          float: right;
          padding-top: px2rem(30px);
          padding-right: px2rem(30px);
          position: absolute;
          top: 0; right: 0;
          .close{
            display: inline-block;
            width: px2rem(20px);
            height: px2rem(20px);
            @include img-retina("~@/assets/lottery-bindBox/icon-close.png",
            "~@/assets/lottery-bindBox/icon-close@2x.png", 100%, 100%);
            background-repeat: no-repeat;
          }
        }
      }
      .container{
        width: 100%;
        height: px2rem(710px);
        padding-top: px2rem(40px);
        position: relative;
        .award-name{
          height: px2rem(32px);
          font-size: px2rem(32px);
          font-family: PingFangSC, PingFangSC-Medium;
          font-weight: 500;
          text-align: center;
          color: #431744;
          line-height: px2rem(32px);
          margin-bottom: px2rem(40px);
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .award-image{
          width: px2rem(160px);
          height: px2rem(160px);
          background: #ffffff;
          border-radius: 50%;
          margin-bottom: px2rem(40px);
          margin-left: auto;
          margin-right: auto;
          padding: px2rem(40px) px2rem(32px);
          img{
            display: inline-block;
            width: px2rem(96px);
            height: px2rem(79px);
          }
        }
        .ticked-wrap{
          position: absolute;
          top:px2rem(101px);
          right: px2rem(30px);
          width: px2rem(122px);
          height: px2rem(102px);
          @include img-retina("~@/assets/lottery-bindBox/convert-bg.png",
          "~@/assets/lottery-bindBox/convert-bg@2x.png", 100%, 100%);
          background-repeat: no-repeat;
          &.ticked-wrap-overdue{
            @include img-retina("~@/assets/lottery-bindBox/overdue-bg.png",
            "~@/assets/lottery-bindBox/overdue-bg@2x.png", 100%, 100%);
          }
        }
        .info-wrap{
            width: px2rem(431px);
            height: px2rem(72px);
            margin-left: px2rem(40px);
            margin-bottom: px2rem(60px);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            p{
                font-size: px2rem(26px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #431744;
                line-height: px2rem(26px);
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
        }
        .btns{
            width: px2rem(240px);
            height: px2rem(80px);
            border-radius: px2rem(40px);
            background: linear-gradient(0deg,#cca4ff, #ffb5f9);
            font-size: px2rem(28px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: center;
            color: #431744;
            line-height: px2rem(80px);
            margin-bottom: px2rem(40px);
            margin-left: auto;
            margin-right: auto;
        }
        .content-next-wrap{
            display: flex;
            // align-items: center;
            margin-left: px2rem(40px);
            .label{
                width: px2rem(140px);
                // height: px2rem(24px);
                opacity: 0.8;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #431744;
                //  line-height: px2rem(24px);
                margin-right: px2rem(16px);
            }
            .value{
                // height: px2rem(24px);
                opacity: 0.8;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #431744;
                // line-height: px2rem(24px);
            }
            .address{
                width: px2rem(426px);
                // height: px2rem(62px);
                height: auto;
                max-height: px2rem(62px);
                overflow-y: scroll;
                // line-height: px2rem(62px);
                opacity: 0.8;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #431744;
                margin-right: px2rem(52px);
                padding-top: px2rem(20px);
                .van-hairline--bottom:after{border-bottom-width:0px;}
                // white-space:normal;
                // word-wrap:break-word;
                // word-break:break-all;
                // .el-textarea__inner{
                //     border: none;
                //     background-color: transparent;

                // }
                // line-height: 24px;
            }
            .edit {
              width: px2rem(72px);
            }
            .righit-icon{
                width: px2rem(22px);
                height: px2rem(22px);
                @include img-retina("~@/assets/lottery-bindBox/icon-edit2.png",
                "~@/assets/lottery-bindBox/icon-edit2@2x.png", 100%, 100%);
                background-repeat: no-repeat;
                cursor: pointer;
            }
        }
        .mb10{
          margin-bottom: px2rem(20px);
        }
      }
    }
  }
}
</style>
