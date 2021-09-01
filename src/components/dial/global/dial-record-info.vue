<template>
  <div class="record-info">
       <DialogPage :show="show" @close="onClose">
           <div slot="title" class="record-info-title">
               <span>中奖记录</span>
           </div>
           <div slot="content" class="record-info-pre">
               <div class="content-pre-title">获得 简约日式实木落地镜</div>
                <div class="content-pre-wrap">
                    <div class="content-pre-circle">
                        <van-image src="https://img01.yzcdn.cn/vant/cat.jpeg" class="avatar"/>
                    </div>
                    <div class="center-icon">
                        <span>一等奖</span>
                    </div>
                    <div class="left-icon"></div>
                    <div class="right-icon"></div>
                </div>
                <div class="content-pre-userInfo">
                    <p>兑奖码：KM13NJDJNCKK </p>
                    <p>工作人员将在7到15个工作日内联系您</p>
                </div>
           </div>
          <div slot="content-next" class="record-info-next">
              <div class="content-next-wrap">
                  <span class="label">肖沾沾</span>
                  <span class="value">15850602022</span>
              </div>
              <div class="content-next-wrap">
                  <textarea name="" id="" cols="30" rows="10">南京市雨花区安德门大街57号楚翘城3号 商务楼6楼</textarea>
                 <div class="righit-icon"></div>
              </div>
          </div>
       </DialogPage>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import DialogPage from '@/components/dial/global/dial-dialog-page'
export default {
  name: '',
  components: { DialogPage },
  props: {
    show: {type: Boolean, require: true}
  },
  data () {
    return {}
  },
  computed: {},
  watch: {
    show (newState) {
      // 更改当前是否显示遮罩的状态
      this.setIsModelShow(newState)
    }
  },
  created () {},
  mounted () {},
  methods: {
    close () {
      this.$emit('close')
    },
    ...mapMutations('dial', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    })
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
        @include img-retina("~@/assets/dial/activityRule/title.png",
        "~@/assets/dial/activityRule/title@2x.png", 100%, 100%);
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
            text-align: left;
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
                @include img-retina("~@/assets/dial/prizeRecord/prize-bg.png",
                "~@/assets/dial/prizeRecord/prize-bg@2x.png", 100%, 100%);
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
                @include img-retina("~@/assets/dial/prizeRecord/left-icon 18.png",
                "~@/assets/dial/prizeRecord/left-icon 18@2x.png", 100%, 100%);
                background-repeat: no-repeat;
                position: absolute;
                bottom: px2rem(30px);left: px2rem(210px);
                z-index: 2;
            }
            .right-icon{
                width: px2rem(26px);
                height: px2rem(24px);
                @include img-retina("~@/assets/dial/prizeRecord/right-icon 18_1.png",
                "~@/assets/dial/prizeRecord/right-icon 18_1@2x.png", 100%, 100%);
                background-repeat: no-repeat;
                position: absolute;
                bottom: px2rem(30px);right: px2rem(210px);
                z-index: 2;
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
            textarea{
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
                margin-bottom: px2rem(20px);
            }
            .righit-icon{
                width: px2rem(22px);
                height: px2rem(22px);
                @include img-retina("~@/assets/dial/prizeRecord/icon-edit_1.png",
                "~@/assets/dial/prizeRecord/icon-edit_1@2x.png", 100%, 100%);
                background-repeat: no-repeat;
                cursor: pointer;
            }
        }
    }
}
</style>
