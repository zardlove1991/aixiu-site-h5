<template>
  <div class="record-info">
       <DialogPage :show="show" @close="onClose">
           <div slot="title" class="record-info-title">
               <span>中奖记录</span>
           </div>
           <div slot="content" class="record-info-pre">
               <div class="content-pre-title">获得{{itemData.prize_info.award_content}}</div>
                <div class="content-pre-wrap">
                    <div class="content-pre-circle">
                        <van-image :src="itemData.prize_info.images" class="avatar"/>
                    </div>
                    <div class="center-icon">
                        <span>{{itemData.prize_info.award_name}}</span>
                    </div>
                    <div class="left-icon"></div>
                    <div class="right-icon"></div>
                    <div class="ticked-wrap" v-if="itemData.status === '已兑奖' "></div>
                </div>
                <div class="content-pre-userInfo">
                    <p>兑奖码：{{itemData.prize_info.code}} </p>
                    <p>工作人员将在7到15个工作日内联系您</p>
                </div>
           </div>
          <div slot="content-next" class="record-info-next">
              <div class="content-next-wrap">
                  <input type="text" placeholder="姓名" class="label" v-model="itemData.prize_info.address[0]" :readonly='edit' />
                  <input type="text" v-model="itemData.prize_info.address[1]" :readonly='edit' class="value" placeholder="手机号" :maxlength="11"
                    @input="itemData.address[1] = itemData.address[1].replace(/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/, '')"/>
                  <!-- <span class="label">肖沾沾</span>
                  <span class="value">15850602022</span> -->
              </div>
              <div class="content-next-wrap">
                  <input type="text" class="address" v-model="itemData.prize_info.address[2]" :readonly='edit' placeholder="详细地址"/>
                  <!-- <textarea name="" id="" cols="30" rows="10" class="address">南京市雨花区安德门大街57号楚翘城3号 商务楼6楼</textarea> -->
                 <div class="righit-icon" v-if="edit" @click="onEdit"></div>
                 <div class="righit-icon" @click="onSubmit" v-else></div>
              </div>
               <van-button  block  class="btn" @click="onClose"><span>返回</span></van-button>
          </div>
       </DialogPage>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import DialogPage from '@/components/lottery/global/dial-dialog-page'
import API from '@/api/module/examination'
export default {
  name: '',
  components: { DialogPage },
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
    console.log(this.itemData)
  },
  mounted () {},
  methods: {
    onClose () {
      this.$emit('close')
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
      console.log(this.itemData.prize_info.address[0])
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
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.record-info{
    .record-info-title{
        width: px2rem(280px);
        height: px2rem(76px);
        opacity: 1;
        position: absolute;
        left: px2rem(160px);
        top:(-10%);
        @include img-retina("~@/assets/lottery/activityRule/title.png",
        "~@/assets/lottery/activityRule/title@2x.png", 100%, 100%);
        background-repeat: no-repeat;
        text-align: center;
        span{
            width: px2rem(144px);
            height: px2rem(36px);
            opacity: 1;
            font-size: px2rem(36px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: center;
            color: #fff4e3;
            line-height: px2rem(76px);
        }
    }
    .record-info-pre{
        position: relative;
        .content-pre-title{
            width: px2rem(363px);
            height: px2rem(36px);
            opacity: 1;
            font-size: px2rem(32px);
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
            text-align: center;
            color: #4f0f0f;
            line-height: px2rem(36px);
            margin-left: auto;
            margin-right: auto;
        }
        .content-pre-wrap{
            // position: absolute;
            // top:px2rem(76px);
            // left:px2rem(220px);
            margin-top: px2rem(40px);
            margin-bottom: px2rem(40px);
            width: 100%;
            height: px2rem(160px);
            .center-icon{
                width: px2rem(152px);
                height: px2rem(38px);
                @include img-retina("~@/assets/lottery/prizeRecord/prize-bg.png",
                "~@/assets/lottery/prizeRecord/prize-bg@2x.png", 100%, 100%);
                background-repeat: no-repeat;
                position: absolute;
                bottom: px2rem(8px); left: px2rem(224px);
                text-align: center;
                z-index: 10;
                span{
                    width: px2rem(60px);
                    height: px2rem(20px);
                    opacity: 1;
                    font-size: px2rem(20px);
                    font-family: SourceHanSansCN, SourceHanSansCN-Medium;
                    font-weight: 500;
                    text-align: center;
                    color: #ffffff;
                    line-height: px2rem(38px);
                }
            }
            .left-icon{
                width: px2rem(26px);
                height: px2rem(24px);
                @include img-retina("~@/assets/lottery/prizeRecord/left-icon 18.png",
                "~@/assets/lottery/prizeRecord/left-icon 18@2x.png", 100%, 100%);
                background-repeat: no-repeat;
                position: absolute;
                bottom: px2rem(30px);left: px2rem(210px);
                z-index: 2;
            }
            .right-icon{
                width: px2rem(26px);
                height: px2rem(24px);
                @include img-retina("~@/assets/lottery/prizeRecord/right-icon 18_1.png",
                "~@/assets/lottery/prizeRecord/right-icon 18_1@2x.png", 100%, 100%);
                background-repeat: no-repeat;
                position: absolute;
                bottom: px2rem(30px);right: px2rem(210px);
                z-index: 2;
            }
             .ticked-wrap{
                width: px2rem(122px);
                height: px2rem(102px);
                opacity: 1;
                background: linear-gradient(135deg,#ff8f68, #ff1a4a);
                position: absolute;
                top:px2rem(42px);right: px2rem(30px);
            }
             .content-pre-circle{
                position: absolute;
                top:px2rem(76px);
                left:px2rem(220px);
                width: px2rem(160px);
                height: px2rem(160px);
                opacity: 1;
                background-color: #ffffff;
                border: px2rem(2px) solid #edd8b0;
                box-sizing: border-box;
                // margin: px2rem(40px) auto;
                border-radius: 50%;
                z-index: 5;
                .avatar{
                    display: block;
                    width: px2rem(94px);
                    height: px2rem(119px);
                    background-repeat: no-repeat;
                    background-size: cover;
                    position: absolute;
                    top:px2rem(20px);left:px2rem(33px);
                }
            }
        }
        .content-pre-userInfo{
            width: px2rem(431px);
            height: px2rem(72px);
            opacity: 1;
            font-size: px2rem(26px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #4f0f0f;
            position: absolute;
            left:px2rem(50px);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            p{
                font-size: px2rem(26px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #4f0f0f;
                line-height: px2rem(26px);
            }
        }
    }
    .record-info-next{
        padding-left: px2rem(50px);
        .content-next-wrap{
            display: flex;
            // align-items: center;
            .label{
                width: px2rem(140px);
                height: px2rem(24px);
                opacity: 0.8;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #4f0f0f;
                 line-height: px2rem(24px);
                margin-right: px2rem(16px);
            }
            .value{
                height: px2rem(24px);
                opacity: 0.8;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #4f0f0f;
                line-height: px2rem(24px);
            }
            .address{
                width: px2rem(426px);
                height: px2rem(62px);
                opacity: 0.8;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #4f0f0f;
                margin-right: px2rem(52px);
                // line-height: 24px;
            }
            &:first-child{
                // margin-top: px2rem(21px);
                padding-top: px2rem(21px);
                margin-bottom: px2rem(20px);
            }
            .righit-icon{
                width: px2rem(22px);
                height: px2rem(22px);
                @include img-retina("~@/assets/lottery/prizeRecord/icon-edit_1.png",
                "~@/assets/lottery/prizeRecord/icon-edit_1@2x.png", 100%, 100%);
                background-repeat: no-repeat;
                cursor: pointer;
            }
        }
        .btn{
            width: px2rem(230px);
            height: px2rem(72px);
            opacity: 1;
            border-radius: px2rem(16px);
            background: linear-gradient(0deg,#ffe2b7 1%, #fff5e2);
            box-shadow: 0 px2rem(16px) 0px 0px #e5b56b;
            margin-left: px2rem(135px);
            border: none;
            margin-right: auto;
            margin-top: px2rem(40px);
            text-align: center;
            span{
                font-size: px2rem(28px);
                font-family: SourceHanSansCN, SourceHanSansCN-Medium;
                font-weight: 500;
                text-align: left;
                color: #4f0f0f;
                line-height: px2rem(72px);
            }
        }
    }
}
</style>
