<template>
  <div class="myenroll-wrap">
    <div
      :class="['myenrll-item', item.status === 3 ? 'disabled' : 'base']"
      v-for="(item, index) in enrollList"
      :key="index"
      @click="getMyEnrllDetail(item)">
      <div class="left-split"><div class="point"></div><div class="line"></div></div>
      <div class="right-content">
        <div class="myenroll-date">
          <i class="myenroll-day-icon"></i>
          <span class="myenroll-date-txt">{{item.create_time}}</span>
        </div>
        <div class="myenroll-info">
          <div class="myenroll-rank">预约排名：{{item.rank}}</div>
          <div class="myenroll-num">预约场次：{{item.num}}</div>
          <div class="myenroll-right-icon"></div>
          <div class="myenroll-bg"></div>
          <div :class="['myenroll-status', statusClass[item.status]]"></div>
        </div>
      </div>
    </div>
    <poster-one-dialog
      :show="isShowOnePoster"
      :setting="posterSetting"
      @close="isShowOnePoster = false">
    </poster-one-dialog>
    <poster-two-dialog
      :show="isShowTwoPoster"
      :setting="posterSetting"
      @close="isShowTwoPoster = false">
    </poster-two-dialog>
  </div>
</template>

<script>
import PosterOneDialog from '@/components/enroll/global/poster-one-dialog'
import PosterTwoDialog from '@/components/enroll/global/poster-two-dialog'
import STORAGE from '@/utils/storage'

export default {
  props: {
    id: String
  },
  data () {
    return {
      statusClass: {
        1: 'await',
        2: 'receive',
        3: 'expire'
      },
      posterType: null,
      isShowOnePoster: false,
      isShowTwoPoster: false,
      posterSetting: {},
      enrollList: [{
        create_time: '2020年9月24日 12:00:00',
        rank: 334,
        num: '9月20日 10:00-11:00',
        status: 1
      }, {
        create_time: '2020年9月24日 12:00:00',
        rank: 334,
        num: '9月20日 10:00-11:00',
        status: 2
      }, {
        create_time: '2020年9月24日 12:00:00',
        rank: 334,
        num: '9月20日 10:00-11:00',
        status: 3
      }]
    }
  },
  components: {
    PosterOneDialog, PosterTwoDialog
  },
  created () {
    this.inintMyEnrllList()
  },
  methods: {
    inintMyEnrllList () {
      let enrollInfo = STORAGE.get('detailInfo')
      if (enrollInfo) {
        let rule = enrollInfo.rule
        if (rule && rule.poster && rule.poster.id) {
          this.posterSetting = rule.poster
          this.posterType = rule.poster.id
        }
      }
      console.log(enrollInfo)
      console.log('inintMyEnrllList', this.id)
    },
    getMyEnrllDetail (item) {
      console.log(item)
      let posterType = this.posterType
      if (posterType) {
        if (posterType === 1) {
          this.isShowTwoPoster = true
        } else {
          this.isShowOnePoster = true
        }
      }
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .myenroll-wrap {
    min-height: 100vh;
    background-color: #fff;
    padding: px2rem(40px) px2rem(30px) px2rem(40px) px2rem(22px);
    .myenrll-item {
      width: 100%;
      height: px2rem(275px);
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      .left-split {
        width: px2rem(16px);
        height: px2rem(275px);
        display: flex;
        flex-direction: column;
        align-items: center;
        .point {
          width: px2rem(16px);
          height: px2rem(16px);
          border-radius: 50%;
          @include bg-linear-color('compColor');
          // background-image: linear-gradient(45deg, #324AFE 0%, #7081FF 100%);
        }
        .line {
          width: 1px;
          height: 100%;
          background-color: #EBEBEB;
        }
      }
      .right-content {
        flex: 1;
        margin-left: px2rem(22px);
        .myenroll-date {
          margin-bottom: px2rem(30px);
          font-size: 0;
          display: flex;
          align-items: center;
          .myenroll-day-icon {
            display: inline-block;
            margin-right: px2rem(10px);
            width: px2rem(25px);
            height: px2rem(24px);
            background-repeat: no-repeat;
            @include img-retina('~@/assets/enroll/myenroll-day-icon@2x.png', '~@/assets/enroll/myenroll-day-icon@3x.png', 100%, 100%);
          }
          .myenroll-date-txt {
            font-size: px2rem(28px);
            line-height: px2rem(14px);
            color: #666;
          }
        }
        .myenroll-info {
          position: relative;
          width: 100%;
          height: px2rem(151px);
          // background-image: linear-gradient(45deg, #324AFE 0%, #7081FF 100%);
          box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.11);
          border-radius: px2rem(10px);
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 px2rem(30px);
          .myenroll-rank {
            font-weight: bold;
            margin-bottom: px2rem(10px);
            @include font-dpr(16px);
            color: #fff;
          }
          .myenroll-num {
            @include font-dpr(12px);
            color: #fff;
          }
          .myenroll-bg {
            position: absolute;
            z-index: 1;
            top: 0;
            left: 0;
            right: 0;
            border-radius: px2rem(10px);
            width: 100%;
            height: px2rem(151px);
            @include img-retina('~@/assets/enroll/myenroll-bg@2x.png', '~@/assets/enroll/myenroll-bg@3x.png', 100%, auto)
          }
          .myenroll-right-icon {
            position: absolute;
            z-index: 2;
            right: px2rem(30px);
            bottom: px2rem(40px);
            width: px2rem(16px);
            height: px2rem(28px);
            @include img-retina('~@/assets/enroll/myenroll-right-icon@2x.png', '~@/assets/enroll/myenroll-right-icon@3x.png', 100%, auto);
          }
          .myenroll-status {
            position: absolute;
            z-index: 1;
            top: 0;
            right: 0;
            width: px2rem(128px);
            height: px2rem(44px);
            &.await {
              @include img-retina('~@/assets/enroll/myenroll-await@2x.png', '~@/assets/enroll/myenroll-await@3x.png', 100%, auto);
            }
            &.expire {
              @include img-retina('~@/assets/enroll/myenroll-expire@2x.png', '~@/assets/enroll/myenroll-expire@3x.png', 100%, auto);
            }
            &.receive {
              @include img-retina('~@/assets/enroll/myenroll-receive@2x.png', '~@/assets/enroll/myenroll-receive@3x.png', 100%, auto);
            }
          }
        }
      }
      &.base .myenroll-info {
        @include bg-linear-color('compColor');
      }
      &.disabled .myenroll-info {
        background-image: linear-gradient(-90deg, #D4D4D4 0%, #C5C5C5 100%);
      }
    }
  }
</style>
