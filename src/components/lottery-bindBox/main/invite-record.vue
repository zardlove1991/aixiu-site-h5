<template>
<div class='invite-record'>
    <div class="back" @click="$router.back()">
        <div class="arrow-left"></div>
    </div>
    <div class="invite-record-header">
        <div class="title">邀请记录</div>
        <div class="chance">增加{{draw}}次抽盲盒机会</div>
    </div>
    <div class="invite-record-container">
        <div class="record-list" v-if="list" :class="{center:list.length===0}">
          <div class="record-list-wrap" :class="{center:list.length===0}">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="pull-refresh">
                <van-list v-model="loading" :finished="finished" @load="onLoad"  :error.sync="error" >
                    <van-cell
                        v-for="item in list"
                        :key="item.id"
                        value="查看"
                        class="list-wrap"
                    >
                    <div slot="title" class="title item-wrap">
                      <img :src="item.help_app_images" alt="" class="help-avatar">
                      <div class="help-name">{{item.help_app_name}}</div>
                    </div>
                    <!-- <div slot="default" class="jump">{{ item.tip }}</div> -->
                    <div slot="default" class="jump item-jump-wrap" >
                      <div class="help-tip">助力</div>
                      <div class="help-count">+{{total}}</div>
                    </div>
                    </van-cell>
                </van-list>
            </van-pull-refresh>
            <div class="bg" :class="{ isShow:list.length===0}"></div>
            <div class="tip" :class="{ isShow:list.length===0}">您还未邀请他人助力哦~</div>
          </div>
        </div>
    </div>
</div>
</template>

<script>
import { setBrowserTitle } from '@/utils/utils'
import API from '@/api/module/examination'
export default {
  name: '',
  components: {
  },
  props: {
    title: { type: String },
    id: { type: String, require: true }
  },
  data () {
    return {
      tempShow: true,
      list: [],
      loading: false,
      finished: false,
      error: false,
      // id: this.$route.params.id,
      currentPage: 1,
      currentCount: 100,
      total: null,
      refreshing: false,
      draw: null
    }
  },
  computed: {

  },
  watch: {
  },
  created () {
  },
  mounted () {
    setBrowserTitle(this.title)
  },
  methods: {
    async onLoad () {
      if (this.refreshing) {
        this.list = []
        this.refreshing = false
      }
      try {
        const res = await API.getInviteInfo({
          query: { id: this.id },
          params: {
            page: this.currentPage,
            count: this.currentCount
          }
        })
        console.log(res)
        if (res.error_code) {
          this.error = true
          this.$toast(res.error_message)
        }
        this.loading = false

        if (res.data.length === 0) {
          this.finished = true
          return false
        }
        this.list.push(...res.data)
        this.total = res.total
        this.draw = res.draw_num
        this.currentPage++
      } catch (error) {
        console.log(error)
        // this.$toast(error)
      }
    },
    async onRefresh () {
      // 清空列表数据
      this.finished = false
      this.currentPage = 1
      this.loading = true
      this.onLoad()
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.invite-record {
  width: 100%;
  // height: px2rem(1448px);
  height: 100vh;
  opacity: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
  @include img-retina("~@/assets/lottery-bindBox/bg.png","~@/assets/lottery-bindBox/bg@2x.png",100%,100%);
  background-repeat: no-repeat;
  .back {
    width: px2rem(64px);
    height: px2rem(60px);
    background-color: rgba(0, 0, 0, .5);
    border-radius: 0px 0px px2rem(100px) px2rem(100px);
    position: absolute;
    left: 0;
    top: px2rem(29px);
    transform: rotate(-90deg);
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
    .arrow-left {
      width: px2rem(17px);
      height: px2rem(32px);
      transform: rotate(-270deg);
      @include img-retina("~@/assets/lottery/diallist/arrow-left.png","~@/assets/lottery/diallist/arrow-left@2x.png", 100%,100%);
      color: #fff;
      opacity: 1;
    }
  }
  .invite-record-header{
    // width: 100%;
    width: px2rem(690px);
    height: px2rem(170px);
    @include img-retina("~@/assets/lottery-bindBox/help-header-bg.png",
    "~@/assets/lottery-bindBox/help-header-bg@2x.png",100%,100%);
    background-repeat: no-repeat;
    // margin-top: px2rem(-107px);
    position: absolute;
    top: px2rem(60px); left: px2rem(30px);
    z-index: 2;
    .title{
        width: px2rem(176px);
        height: px2rem(44px);
        font-size: px2rem(44px);
        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
        font-weight: 500;
        text-align: center;
        color: #ffffff;
        line-height: px2rem(44px);
        margin-top: px2rem(40px);
        margin-bottom: px2rem(20px);
        margin-left: auto;
        margin-right: auto;
    }
    .chance{
        // width: px2rem(237px);
        height: px2rem(26px);
        opacity: 0.9;
        font-size: px2rem(26px);
        font-family: SourceHanSansCN, SourceHanSansCN-Regular;
        font-weight: 400;
        text-align: center;
        color: #ffffff;
        line-height: px2rem(26px);
        margin-left: auto;
        margin-right: auto;
    }
  }
  .invite-record-container{
    width: 100%;
    height: px2rem(1309px);
    position: absolute;
    top: px2rem(60px); left: 0;
    .record-list{
        width: calc(100% - (30px));
        height: px2rem(1259px);
        background: #ffffff;
        border-radius: px2rem(24px);
        box-shadow: 0px px2rem(6px) px2rem(14px) px2rem(2px) rgba(0,0,0,0.06);
        margin-left: auto;
        margin-right: auto;
        padding-top: px2rem(170px);
        padding-left: px2rem(30px);
        padding-right: px2rem(40px);
        .record-list-wrap{
          width: 100%;
          height: px2rem(1001px);
          overflow-y: auto;
          &.center {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        }
        // .pull-refresh{
        //     overflow-y: auto;
        //     width: 100%;
        //     height: px2rem(1001px);
        // }
        &.center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        &.pl40 {
            padding-left: px2rem(40px);
        }
        &.pr40 {
            padding-right: px2rem(40px);
        }
        .list-wrap {
            height: px2rem(100px);
            line-height: px2rem(100px);
            .title {
                font-family: SourceHanSansCN, SourceHanSansCN-Regular;
                font-weight: 400;
                text-align: left;
                color: #333333;
                opacity: 1;
                font-size: px2rem(28px);
                line-height: px2rem(100px);
            }
            .item-wrap{
              display: flex;
              align-items: center;
              padding-top: px2rem(27px);
              padding-bottom: px2rem(27px);
              .help-avatar{
                width: px2rem(48px);
                height: px2rem(48px);
                border-radius: 50%;
                margin-right: px2rem(12px);
              }
              .help-name{
                height: px2rem(28px);
                font-size: px2rem(28px);
                font-family: SourceHanSansCN, SourceHanSansCN-Regular;
                font-weight: 400;
                text-align: left;
                color: #333333;
                line-height: px2rem(28px);
              }
            }
            .labelClass {
                width: px2rem(60px);
            }
            .jump {
                opacity: 0.6;
                font-size: px2rem(28px);
                font-family: SourceHanSansCN, SourceHanSansCN-Regular;
                font-weight: 400;
                text-align: right;
                color: #333333;
                line-height: px2rem(100px);
                &.is-hide{
                    display: none;
                }
            }
            .item-jump-wrap{
              // width: 100%;
              // height: 100%;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              padding-top: px2rem(27px);
              padding-bottom: px2rem(27px);
            }
            .help-tip {
              height: px2rem(28px);
              font-size: px2rem(28px);
              font-family: SourceHanSansCN, SourceHanSansCN-Regular;
              font-weight: 400;
              text-align: left;
              color: #333333;
              line-height: px2rem(50px);
              // float: right;
            }
            .help-count {
              height: px2rem(28px);
              font-size: px2rem(28px);
              font-family: SourceHanSansCN, SourceHanSansCN-Regular;
              font-weight: 400;
              text-align: left;
              color: #ff6a45;
              line-height: px2rem(50px);
              // float: right;
            }
            &::after {
                width: 100%;
                opacity: 0.2;
                border-bottom-style: dashed;
                border-bottom-color: #4f0f0f;
            }
        }
        .bg {
          width: px2rem(264px);
          height: px2rem(216px);
          margin-left: px2rem(99px);
          margin-bottom: px2rem(10px);
          @include img-retina(
          "~@/assets/lottery-bindBox/undraw-bg.png",
          "~@/assets/lottery-bindBox/undraw-bg@2x.png",
          100%,
          100%
          );
          background-position-x: right;
          background-repeat: no-repeat;
          display: none;
          &.isShow{
            display: block;
          }
        }
        .tip {
          // width: px2rem(208px);
          height: px2rem(32px);
          opacity: 1;
          font-size: px2rem(32px);
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: center;
          color: #999999;
          line-height: px2rem(32px);
          z-index: 10;
          display: none;
          &.isShow{
            display: block;
          }
      }
    }
  }
}
</style>
