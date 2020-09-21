<template>
  <div class="myenroll-wrap">
    <div
      :class="['myenrll-item', item.status === 2 ? 'disabled' : 'base']"
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
          <div :class="['myenroll-status', item.color_name ? item.color_name : '']"></div>
        </div>
      </div>
    </div>
    <div v-if="!noMore" class="scroll-tips" @click="getMineEnrollList()">点击我，加载更多</div>
    <div class="loading-box" v-if="loading">
      <mt-spinner type="fading-circle" class="loading-more"></mt-spinner>
      <span class="loading-more-txt">加载中...</span>
    </div>
    <poster-one-dialog
      :show="isShowOnePoster"
      :setting="posterSetting"
      :posterData="currentData"
      @close="isShowOnePoster = false">
    </poster-one-dialog>
    <poster-two-dialog
      :show="isShowTwoPoster"
      :setting="posterSetting"
      :posterData="currentData"
      @close="isShowTwoPoster = false">
    </poster-two-dialog>
  </div>
</template>

<script>
import PosterOneDialog from '@/components/enroll/global/poster-one-dialog'
import PosterTwoDialog from '@/components/enroll/global/poster-two-dialog'
import STORAGE from '@/utils/storage'
import { InfiniteScroll, Spinner } from 'mint-ui'
import API from '@/api/module/examination'

export default {
  props: {
    id: String
  },
  data () {
    return {
      posterType: null,
      isShowOnePoster: false,
      isShowTwoPoster: false,
      posterSetting: {},
      themeColorName: '',
      currentData: {},
      loading: false,
      pager: {
        total: 0,
        page: 0,
        count: 2,
        totalPages: 0
      },
      enrollList: []
    }
  },
  components: {
    PosterOneDialog, PosterTwoDialog, InfiniteScroll, Spinner
  },
  created () {
    this.initData()
  },
  computed: {
    noMore () {
      // 当起始页数大于总页数时停止加载
      let { page, totalPages } = this.pager
      return page >= totalPages
    }
  },
  methods: {
    initData () {
      let enrollInfo = STORAGE.get('detailInfo')
      if (enrollInfo) {
        let rule = enrollInfo.rule
        let pageSetup = enrollInfo.page_setup
        if (pageSetup.color_scheme && pageSetup.color_scheme.name) {
          this.themeColorName = pageSetup.color_scheme.name
        }
        if (rule && rule.poster && rule.poster.id) {
          this.posterSetting = rule.poster
          this.posterType = rule.poster.id
        }
      }
      this.getMineEnrollList()
    },
    getMineEnrollList () {
      this.loading = true
      let { page, count } = this.pager
      let params = {
        page: page + 1,
        count,
        order_id: this.id
      }
      API.getMineEnrollList({ params: params }).then(res => {
        let { data, page: pageInfo } = res
        if (!data || !data.length) {
          this.loading = false
          return
        }
        let { total, current_page: page } = pageInfo
        total = parseInt(total)
        page = parseInt(page)
        // 总页数
        let totalPages = total / count
        if (total % count !== 0) {
          totalPages = parseInt(totalPages) + 1
        }
        for (let item of data) {
          let { status, sections } = item
          let num = ''
          if (sections) {
            let showTime = ''
            if (sections.type === 0) {
              showTime = '全天'
            } else {
              showTime = sections.start_time + '-' + sections.end_time
            }
            num = sections.date + ' ' + showTime
          }
          item.color_name = this.getThemeColor(status)
          item.num = num
        }
        this.enrollList = this.enrollList.concat(data)
        this.pager = { total, page, count, totalPages }
        this.loading = false
      })
    },
    getThemeColor (status) {
      let themeColorName = this.themeColorName
      let str = ''
      if (status === 0) {
        // 待领取
        if (themeColorName === 'orderorange') {
          str = 'await2'
        } else {
          str = 'await1'
        }
      } else if (status === 1) {
        // 已领取
        if (['orderorangered', 'orderred', 'ordergreen'].includes(themeColorName)) {
          str = 'receive2'
        } else {
          str = 'receive1'
        }
      } else if (status === 2) {
        // 已过期
        str = 'expire'
      }
      return str
    },
    getMyEnrllDetail (item) {
      this.currentData = item
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
    height: 100vh;
    background-color: #fff;
    padding: px2rem(40px) px2rem(30px) px2rem(40px) px2rem(22px);
    overflow-y: auto;
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
            &.await1 {
              @include img-retina('~@/assets/enroll/myenroll/await-icon1@2x.png', '~@/assets/enroll/myenroll/await-icon1@3x.png', 100%, auto);
            }
            &.await2 {
              @include img-retina('~@/assets/enroll/myenroll/await-icon2@2x.png', '~@/assets/enroll/myenroll/await-icon2@3x.png', 100%, auto);
            }
            &.receive1 {
              @include img-retina('~@/assets/enroll/myenroll/receive-icon1@2x.png', '~@/assets/enroll/myenroll/receive-icon1@3x.png', 100%, auto);
            }
            &.receive2 {
              @include img-retina('~@/assets/enroll/myenroll/receive-icon2@2x.png', '~@/assets/enroll/myenroll/receive-icon2@3x.png', 100%, auto);
            }
            &.expire {
              @include img-retina('~@/assets/enroll/myenroll/expire-icon@2x.png', '~@/assets/enroll/myenroll/expire-icon@3x.png', 100%, auto);
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
    .scroll-tips {
      width: 100%;
      @include font-dpr(14px);
      color:#666;
      text-align: center;
    }
    .loading-box {
      display: flex;
      align-items: center;
      justify-content: center;
      .loading-more-txt {
        display: inline-block;
        margin-left: px2rem(20px);
        @include font-dpr(14px);
        color:#ccc;
      }
    }
  }
</style>
