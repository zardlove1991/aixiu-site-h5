<template>
    <div class="record-prize">
        <div class="record-prize-header-bg"></div>
        <div class="back" @click="$router.back()">
            <div class="arrow-left"></div>
        </div>
        <div class="record-prize-content-bg"></div>
        <div class="logo"></div>
        <div class="record-prize-container">
            <div class="record-prize-content">
                <h3>中奖记录</h3>
                <div class="container pl40 pr40" v-if="list" :class="{center:list.length===0}">
                <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
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
    <!-- <CardIntegralPull :show.sync='isCardIintegralPullShow' v-if="isCardIintegralPullShow" @close='isCardIintegralPullShow = false' :data.sync="tempItem"/> -->
    <CardStock :show.sync='isCardStockShow' v-if="isCardStockShow" @close='isCardStockShow=false' :data.sync="tempItem"/>
    <CardOverdues :show.sync='isCardOverduesShow' v-if='isCardOverduesShow' @close='isCardOverduesShow = false' :data.sync="tempItem"/>
    <RecordUncode :show.sync='isRecordUncodeShow' v-if="isRecordUncodeShow" @close='isRecordUncodeShow = false' :data.sync="tempItem"/>
    <RecordCode :show.sync='isRecordCodeShow' v-if="isRecordCodeShow" @close='isRecordCodeShow = false' :data.sync="tempItem"/>
    <RecordTicketed :show.sync='isRecordTicketedShow' v-if="isRecordTicketedShow" @close='isRecordTicketedShow = false' :data.sync="tempItem"/>
    <RecordInfo :show.sync='isRecordInfoShow' v-if="isRecordInfoShow"  @close='isRecordInfoShow = false' :data.sync="tempItem" :activityId="id"/>
    <!-- <CardPacket :show='isCardPacketShow' @close='isCardPacketShow = false'/> -->
    <CardPacketPull :show.sync='isCardPacketPullShow' v-if="isCardPacketPullShow" @close='isCardPacketPullShow = false' :data.sync="tempItem"/>

    <!-- <CardPacketPulls :show.sync="tempShow" @close='tempShow = false'/> -->
    </div>
</template>

<script>
import API from '@/api/module/examination'
// import CardIntegral from '@/components/lottery/global/dial-card-integral'
// import CardIntegralPull from '@/components/lottery/global/dial-card-integralPull'
// import CardStock from '@/components/lottery/global/dial-card-stock'
// import CardOverdues from '@/components/lottery/global/dial-card-overdues'
// import RecordUncode from '@/components/lottery/global/dial-record-uncode'
// import RecordCode from '@/components/lottery/global/dial-record-code'
import RecordTicketed from '@/components/lottery/global/dial-record-ticketed'
import RecordInfo from '@/components/lottery/global/dial-record-info'
// import CardPacket from '@/components/lottery/global/dial-card-packet'
// import CardPacketPull from '@/components/lottery/global/dial-card-packetPull'
import RecordUncode from '@/components/lottery/global/record-uncode'
import RecordCode from '@/components/lottery/global/record-code'
import CardOverdues from '@/components/lottery/global/card-overdues'
import CardIntegralPull from '@/components/lottery/global/card-integralPull'
import CardIntegral from '@/components/lottery/global/card-integral'
import CardStock from '@/components/lottery/global/card-stock'
import CardPacketPull from '@/components/lottery/global/card-packetPull'
export default {
  name: '',
  components: {
    // RecordUncodes,
    // RecordCodes,
    // CardOverduess,
    // CardIntegralPulls,
    // CardIntegrals,
    // CardStocks,
    // CardPacketPulls,

    CardIntegral,
    CardIntegralPull,
    CardOverdues,
    RecordUncode,
    RecordCode,
    RecordTicketed,
    RecordInfo,
    // CardPacket,
    CardPacketPull,
    CardStock
  },
  props: {
  },
  data () {
    return {
      tempShow: true,
      list: [],
      loading: false,
      finished: false,
      error: false,
      id: this.$route.params.id,
      currentPage: 1,
      currentCount: 100,
      total: null,
      refreshing: false,
      tempItem: {}, // 临时对象
      isCardIntegralShow: false, // 控制积分纪录状态
      isCardIintegralPullShow: false, // // 控制积分已领取纪录状态
      isCardStockShow: false, // 控制卡劵纪录状态
      isCardPacketShow: false, // 控制红包纪录状态
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
      // this.finished = false

      // // 重新加载数据
      // // 将 loading 设置为 true，表示处于加载状态
      // this.loading = true
      // this.onLoad()
    },
    onLook (item) {
      if (this.tempItem) {
        this.tempItem = {}
      }
      console.log(item)
      if (item.prize_type === 5) {
        if (item.status === '已兑奖') {
          this.tempItem = item
          this.isCardIintegralPullShow = true
        } else {
          this.tempItem = item
          this.isCardIntegralShow = true
        }
      } else if (item.prize_type === 4) {
        this.tempItem = item
        if (this.tempItem.prize_info.qr_code instanceof Array) {
          let images = this.getImage(this.tempItem.prize_info.qr_code[0])
          this.tempItem.prize_info.qr_code = this.tempItem.prize_info.qr_code ? images : this.tempItem.prize_info.qr_code
          this.$set(this.tempItem.prize_info, 'qr_code', this.tempItem.prize_info.qr_code)
        }
        this.isCardStockShow = true
        // console.log(this.tempItem, 'tempItemtempItemtempItem')
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
        } else if (item.prize_info.give_aways === 1 && !item.prize_info.qr_code && item.status_name === '已抽中') {
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
    },
    getImage (image = {}, width, height) {
      if (image instanceof Array && image.length === 0) {
        return ''
      } else if (typeof image === 'string' || image instanceof Object) {
        let src = (typeof image === 'string') ? image : image.host + image.filename
        src = src || ''
        if (src) { // 替换域名
          src = src.replace('pimg.aihoge.com', 'xzimg.hoge.cn')
          src = src.replace('pimg.xiuzan.com', 'pimg-ax.aihoge.com')
          src = src.replace('pimg.v2.xiuzan.com', 'pimg-ax.aihoge.com')
          src = src.replace('pimg.v2.aihoge.com', 'pimg-ax.aihoge.com')
        }
        width = isNaN(width) ? 0 : width
        height = isNaN(height) ? 0 : height
        if (image.process || width || height) {
          src += '?x-oss-process=image'
        }
        if (image.process && image.process.crop) { // 先裁切，再缩放
          src += '/crop,' + image.process.crop
        }
        if (width > 0 && !height) { // 宽度优先，高度等比缩放
          src += `/resize,w_${width}`
        } else if (height > 0 && !width) { // 高度优先，宽度等比缩放
          src += `/resize,h_${height}`
        } else if (width && height) { // 指定宽高
          src += `/resize,m_mfit,h_${height},w_${width}/crop,x_0,y_0,w_${width},h_${height}`
        } else if (image.process && image.process.resize) {
          src += `/resize,${image.process.resize}`
        }
        const protocol = window.location.protocol
        if (src) {
          src = src.startsWith('//') ? protocol + src : src.replace(/^https?/, protocol.split(':')[0])
        }
        // const protocol = window.location.protocol
        // const handelSrc = src.replace(/^https?/, protocol.split(':')[0])
        return src
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.record-prize {
  width: 100%;
  height: px2rem(1448px);
  // height: 100vh;
  opacity: 1;
  background: linear-gradient(181deg, #ff8f68 0%, #ff093f 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: px2rem(127px);
  .record-prize-header-bg {
    width: 100%;
    height: px2rem(213px);
    opacity: 1;
    @include img-retina(
      "~@/assets/lottery/diallist/header-bg.png",
      "~@/assets/lottery/diallist/header-bg.png",
      100%,
      100%
    );
    background-repeat: no-repeat;
    position: absolute;
    // top: -9%;
    top: 0; left: 0;
  }
  .back {
    width: px2rem(64px);
    height: px2rem(60px);
    background-color: rgba(0, 0, 0, .2);
    border-radius: 0px 0px px2rem(100px) px2rem(100px);
    position: absolute;
    // left: -1%;
    left: 0;
    top: px2rem(30px);
    transform: rotate(-90deg);
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
      background-position-x: left;
      color: #fff;
      opacity: 1;
    }
  }
  .record-prize-container{
    width: 100%;
    height: px2rem(1321px);
    position: absolute;
    top: px2rem(127px); left: 0;
    .record-prize-content{
        width: calc(100% - (30px));
        // width: px2rem(690px);
        // height: px2rem(1270px);
        height: px2rem(1281px);
        background: #ffffff;
        border-radius: px2rem(16px);
        margin-left: auto;
        margin-right: auto;
        padding-top: px2rem(66px);
        // padding-top: px2rem(77px);
        h3 {
            width: px2rem(160px);
            height: px2rem(40px);
            opacity: 1;
            font-size: px2rem(40px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            // font-weight: 500;
            font-weight: bolder;
            text-align: left;
            color: #333333;
            line-height: px2rem(60px);
            margin-left: auto;
            margin-right: auto;
            text-align: center;
            margin-bottom: px2rem(40px);
        }
        .container {
            width: 100%;
            // height: 80%;
            // height: px2rem(1124px);
            height: px2rem(1135px);
            // height: 100%;
            border-radius: px2rem(16px);
            background-color: #ffffff;
            box-shadow: 0px px2rem(6px) 0px px2rem(2px) rgba(0,0,0,0.12);
            position: relative;
            overflow-y: auto;
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
                width: px2rem(299px);
                height: px2rem(228px);
                margin-left: px2rem(99px);
                @include img-retina(
                "~@/assets/lottery/unRecord/bg_2.png",
                "~@/assets/lottery/unRecord/bg_2@2x.png",
                100%,
                100%
                );
                background-position-x: right;
                background-repeat: no-repeat;
                display: none;
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
            }
        }
    }
  }
  .logo{
    // position: absolute;
    // top: px2rem(40px); left: px2rem(205px);
    margin-top: px2rem(-87px);
    margin-left: auto;
    margin-right: auto;
    width: px2rem(339px);
    height: px2rem(157px);
    @include img-retina(
        "~@/assets/lottery/diallist/bg.png",
        "~@/assets/lottery/diallist/bg@2x.png",
        100%,
        100%
    );
    z-index: 2;
    // @include img-retina("~@/assets/lottery/modelImg/model-bg.png",
    // "~@/assets/lottery/modelImg/model-bg.png", 100%, 100%);
  }
  .record-prize-content-bg{
    // width: px2rem(750px);
    width: 100%;
    height: px2rem(520px);
    @include img-retina(
      "~@/assets/lottery/diallist/bg1.png",
      "~@/assets/lottery/diallist/bg1.png",
      100%,
      100%
    );
    background-repeat: no-repeat;
    position: absolute;
    top: px2rem(488px);
  }
}
</style>
