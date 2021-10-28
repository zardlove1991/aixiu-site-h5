<template>
  <div class="record-prize">
    <div class="back" @click="$router.back()">
      <div class="arrow-left"></div>
    </div>
    <div class="record-header">
      <div class="title">中奖记录</div>
    </div>
    <div class="record-prize-container">
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
              <div slot="title" class="title">{{ item.prize_content }}</div>
              <!-- <div slot="default" class="jump">{{ item.tip }}</div> -->
              <div slot="default" class="jump" @click="onLook(item)" :class="{'is-hide': item.prize_type === 6}" >查看</div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
          <div class="bg" :class="{ isShow:list.length===0}"></div>
          <div class="tip" :class="{ isShow:list.length===0}">您还未中奖哦~</div>

        </div>
      </div>
    </div>
    <CardIntegral :show.sync='isCardIntegralShow' v-if="isCardIntegralShow" @close='isCardIntegralShow = false' :data.sync="tempItem"/>
    <CardStock :show.sync='isCardStockShow' v-if="isCardStockShow" @close='isCardStockShow=false' :data.sync="tempItem"/>
    <CardPacketPull :show.sync='isCardPacketPullShow' v-if="isCardPacketPullShow" @close='isCardPacketPullShow = false' :data.sync="tempItem"/>
    <CardOverdues :show.sync='isCardOverduesShow' v-if='isCardOverduesShow' @close='isCardOverduesShow = false' :data.sync="tempItem"/>
    <RecordCode :show.sync='isRecordCodeShow' v-if="isRecordCodeShow" @close='isRecordCodeShow = false' :data.sync="tempItem"/>
    <RecordInfo :show.sync='isRecordInfoShow' v-if="isRecordInfoShow"  @close='isRecordInfoShow = false' :data.sync="tempItem" :activityId="id"/>
    <RecordUncode :show.sync='isRecordUncodeShow' v-if="isRecordUncodeShow" @close='isRecordUncodeShow = false' :data.sync="tempItem"/>
    <RecordTicketed :show.sync='isRecordTicketedShow' v-if="isRecordTicketedShow" @close='isRecordTicketedShow = false' :data.sync="tempItem"/>
    <!-- <RecordTicketed :show.sync="tempShow" @close='tempShow = false'/> -->
  </div>
</template>

<script>
import CardIntegral from '@/components/lottery-bindBox/global/card-integral' // 积分记录
import CardStock from '@/components/lottery-bindBox/global/card-stock' // 卡劵记录
import CardPacketPull from '@/components/lottery-bindBox/global/card-packetPull' // 红包记录
import CardOverdues from '@/components/lottery-bindBox/global/card-overdues' // 优惠劵记录
import RecordCode from '@/components/lottery-bindBox/global/record-code' // 实物-带二维码的记录
import RecordUncode from '@/components/lottery-bindBox/global/record-uncode' // 实物-无二维码的记录
import RecordTicketed from '@/components/lottery-bindBox/global/record-ticketed' // 实物-已兑奖的记录
import RecordInfo from '@/components/lottery-bindBox/global/record-info' // 线上实物记录
import API from '@/api/module/examination'
import { setBrowserTitle } from '@/utils/utils'
export default {
  name: '',
  components: {
    CardIntegral, // 积分记录
    CardPacketPull, // 红包记录
    CardOverdues, // 优惠劵记录
    RecordCode, // 实物-带二维码的记录
    RecordUncode, // 实物-无二维码的记录
    RecordTicketed, // 实物-已兑奖的记录
    RecordInfo, // 线上实物记录
    CardStock // 卡劵记录
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
      tempItem: {}, // 临时对象
      isCardIntegralShow: false, // 控制积分纪录状态
      isCardIintegralPullShow: false, // 控制积分已领取纪录状态
      isCardStockShow: false, // 控制卡劵纪录状态
      isCardPacketPullShow: false, // 控制红包已领取纪录状态
      isCardOverduesShow: false, // 控制优惠券-已过期状态
      isRecordUncodeShow: false, // 控制实物核销-无码纪录状态
      isRecordCodeShow: false, // 控制实物核销-有码纪录状态
      isRecordInfoShow: false, // 控制中奖纪录-个人信息状态
      isRecordTicketedShow: false // 控制实物核销-已兑奖状态
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
        const res = await API.getMyPrizeRecord({ query: { id: this.id },
          params: {
            page: this.currentPage,
            count: this.currentCount
          } })
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
    },
    onLook (item) {
      if (this.tempItem) {
        this.tempItem = {}
      }
      console.log(item, 'itemmm')
      if (item.prize_type === 5) {
        this.tempItem = item
        this.isCardIintegralPullShow = true
        // if (item.status === '已兑奖') {
        //   this.tempItem = item
        //   this.isCardIintegralPullShow = true
        // } else {
        //   this.tempItem = item
        //   this.isCardIntegralShow = true
        // }
      } else if (item.prize_type === 4) {
        this.tempItem = item
        if (this.tempItem.prize_info.qr_code instanceof Array) {
          let images = this.getImage(this.tempItem.prize_info.qr_code[0])
          this.tempItem.prize_info.qr_code = this.tempItem.prize_info.qr_code ? images : this.tempItem.prize_info.qr_code
          this.$set(this.tempItem.prize_info, 'qr_code', this.tempItem.prize_info.qr_code)
        }
        this.isCardStockShow = true
      } else if (item.prize_type === 3) {
        this.tempItem = item
        this.isCardPacketPullShow = true
      } else if (item.prize_type === 2) {
        this.tempItem = item
        // console.log(this.tempItem, 'tempItem')
        this.isCardOverduesShow = true
      } else if (item.prize_type === 1) {
        // console.log(item.prize_info.give_aways === 1 && !item.prize_info.qr_code && item.status_name === '已抽中')
        this.tempItem = item
        if (this.tempItem.prize_info.qr_code instanceof Array || this.tempItem.prize_info.images instanceof Array) {
          let code = this.getImage(this.tempItem.prize_info.qr_code[0])
          this.tempItem.prize_info.qr_code = this.tempItem.prize_info.qr_code ? code : this.tempItem.prize_info.qr_code
          let images = this.getImage(this.tempItem.prize_info.images[0])
          this.tempItem.prize_info.images = this.tempItem.prize_info.images ? images : this.tempItem.prize_info.images
          this.$set(this.tempItem, 'prize_info', this.tempItem.prize_info)
        }
        console.log(item.prize_info)
        if (item.prize_info.give_aways === 2) {
          this.isRecordInfoShow = true
          // this.isRecordTicketedShow = true
        } else if ((item.prize_info.give_aways === 1 && item.prize_info.qr_code && item.status_name === '已抽中') || (item.prize_info.give_aways === 1 && item.prize_info.qr_code && item.status_name === '已过期')) {
          if (this.tempItem.prize_info.award_time instanceof Array) {
            this.tempItem.prize_info.award_time = this.tempItem.prize_info.award_time[0] + ' 至 ' + this.tempItem.prize_info.award_time[1]
          }
          this.isRecordCodeShow = true
        } else if ((item.prize_info.give_aways === 1 && !item.prize_info.qr_code && item.status_name === '已抽中') || (item.prize_info.give_aways === 1 && !item.prize_info.qr_code && item.status_name === '已过期')) {
          if (this.tempItem.prize_info.award_time instanceof Array) {
            this.tempItem.prize_info.award_time = this.tempItem.prize_info.award_time[0] + ' 至 ' + this.tempItem.prize_info.award_time[1]
          }
          this.isRecordUncodeShow = true
        } else if (item.prize_info.give_aways === 1 && item.status_name === '已兑奖') {
          if (this.tempItem.prize_info.award_time instanceof Array) {
            this.tempItem.prize_info.award_time = this.tempItem.prize_info.award_time[0] + ' 至 ' + this.tempItem.prize_info.award_time[1]
          }
          this.isRecordTicketedShow = true
        }
        // this.isCardOverduesShow = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.record-prize {
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
    top: px2rem(30px);
    transform: rotate(-90deg);
    z-index: 10;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    // padding: px2rem(14px) px2rem(29px) px2rem(14px) px2rem(18px);
    .arrow-left {
      width: px2rem(17px);
      height: px2rem(32px);
      transform: rotate(-270deg);
      @include img-retina(
        "~@/assets/lottery/diallist/arrow-left.png",
        "~@/assets/lottery/diallist/arrow-left@2x.png",
        100%,
        100%
      );
    //   background-position-x: left;
      color: #fff;
      opacity: 1;
    }
  }
  .record-header{
    // width: 100%;
    width: px2rem(690px);
    height: px2rem(227px);
    @include img-retina("~@/assets/lottery-bindBox/record-header.png",
    "~@/assets/lottery-bindBox/record-header@2x.png",100%,100%);
    background-repeat: no-repeat;
    // margin-top: px2rem(-107px);
    position: absolute;
    top: px2rem(31px); left: px2rem(30px);
    z-index: 10;
    .title{
      width: px2rem(176px);
      height: px2rem(44px);
      font-size: px2rem(44px);
      font-family: SourceHanSansCN, SourceHanSansCN-Medium;
      font-weight: 500;
      text-align: center;
      color: #ffffff;
      line-height: px2rem(44px);
      margin-top: px2rem(152px);
      margin-left: auto;
      margin-right: auto;
    }
  }
  .record-prize-container{
    width: 100%;
    height: px2rem(1309px);
    position: absolute;
    top: px2rem(139px); left: 0;
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
      //   overflow-y: auto;
      //   width: 100%;
      //   height: px2rem(1001px);
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
        width: px2rem(208px);
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
