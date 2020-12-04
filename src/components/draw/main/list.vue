<template>
  <div class="my-draw-list">
    <div class="filter">
      <div class="flex">
        <div>
          <div class="input-box">
            <el-cascader
              v-model="date"
              popper-class="my-draw-list-popper"
              :props="{value: dateOptions.value}"
              :options="dateOptions"
              @change="resetPage('date', $event)"></el-cascader>
          </div>
        </div>
        <div>
          <div class="input-box">
            <el-cascader
              v-model="status"
              :placeholder="'领取状态'"
              popper-class="my-draw-list-popper"
              :options="statusOptions"
              @change="resetPage('status', $event)"></el-cascader>
          </div>
        </div>
      </div>
      <div class="overview-content-wrap">
        <mt-loadmore
            ref="loadmore"
            :bottom-method="loadMore"
            :bottom-all-loaded="noMore"
            :auto-fill="false">
            <div class="wrap">
              <!-- 1 -->
              <div class="item" v-for="(draw, index) in listDate" :key="index" @click="goLotteryPage(draw)">
                <div class="flex">
                  <div class="status">
                    <img :src="require(`@/assets/draw/status_${draw.status}.png`)" alt="">
                  </div>
                  <div class="img-box" :class="`img_type${draw.gift_type}`">
                    <img :src="checkImg(draw)" alt="">
                  </div>
                  <div class="detail-box">
                    <div>
                      <div class="level">{{draw.reward_title}}</div>
                    </div>
                    <div class="title">{{draw.gift_title}}</div>
                    <div class="desc">{{draw.activity_title}}</div>
                    <div class="date">{{draw.draw_time}}</div>
                  </div>
                </div>
              </div>
              <!--  -->
              <div v-show="!loading && !noMore" class="scroll-tips">—— 滑动加载更多 ——</div>
            </div>
            <div slot="bottom" class="mint-loadmore-top">
              <div class="loading-box" v-if="!noMore && loading">
                <mt-spinner type="fading-circle" class="loading-more"></mt-spinner>
                <span class="loading-more-txt">正在加载中</span>
              </div>
              <div v-show="!loading && noMore" class="scroll-tips">—— 底都被你看完啦 ——</div>
            </div>
        </mt-loadmore>
      </div>
    </div>
  </div>
</template>
<script>
import mixins from '@/mixins/index'
import { Loadmore } from 'mint-ui'
import API from '@/api/module/examination'
export default {
  mixins: [mixins],
  data () {
    return {
      date: '',
      dateOptions: [
        {value: '2019-10', label: '2019-10'}
      ],
      status: '',
      statusOptions: [
        {value: '', label: '全部'},
        {value: 2, label: '已领取'},
        {value: 1, label: '未领取'},
        {value: 3, label: '已过期'}
      ],
      page: 1,
      size: 10,
      noMore: false,
      loading: false,
      listDate: []
    }
  },
  components: {Loadmore},
  mounted () {
    this.setDateOptions()
  },
  methods: {
    // 2019年10月至今
    setDateOptions () {
      let startYear = 2019
      let startMonth = 10
      const nowTime = new Date()
      const _year = nowTime.getFullYear()
      const _month = nowTime.getMonth() + 1
      const totalMonth = (_year - startYear) * 12 - startMonth + _month
      for (let i = 0; i < totalMonth; i++) {
        startMonth += 1
        if (startMonth > 12) {
          startMonth = 1
          startYear++
        }
        const _date = startYear + '-' + startMonth.toString().padStart(2, '0')
        this.dateOptions.unshift({
          value: _date,
          label: _date
        })
      }
      this.date = this.dateOptions[0].value
      this.$nextTick(() => {
        this.getDate()
      })
    },
    resetPage (type, value) {
      this.page = 1
      this.noMore = false
      this.listDate = []
      if (type === 'date') {
        this.date = value[0]
      } else if (type === 'status') {
        this.status = value[0]
      }
      this.$nextTick(() => {
        this.getDate()
      })
    },
    getDate () {
      let query = {
        status: this.status,
        draw_time: this.date,
        page: this.page,
        size: this.size
      }
      this.loading = true
      API.getMyDrawList({
        params: {...query}
      }).then(res => {
        this.loading = false
        let {data} = res
        if (data.length < this.size) {
          this.noMore = true
        }
        this.listDate.push(...data)
        this.$nextTick(() => {
          this.$refs.loadmore.onBottomLoaded()
        })
      }).catch(() => {
        this.loading = false
      })
    },
    loadMore () {
      this.page++
      this.$nextTick(() => {
        this.getDate()
      })
    },
    checkImg (data) {
      if (data.cover_url) {
        return data.cover_url
      } else if (data.gift_type === 18) {
        // 微信优惠券
        return require('@/assets/draw/kaquan.png')
      } else if (data.gift_type === 1) {
        // 红包
        return require('@/assets/draw/hongbao.png')
      } else if (data.gift_type === 23) {
        // 卡券
        return require('@/assets/draw/coupon.png')
      } else {
        return ''
      }
    },
    goLotteryPage (draw) {
      let { h5_url: h5Url } = draw
      let link = h5Url.split('?t=')[0]
      window.location.href = link +
        '?lotteryEnterType=history' +
        '&time=' + new Date().getTime()
    }
  }
}
</script>
<style lang="scss">
  @import "@/styles/index.scss";
  div.my-draw-list-popper {
    margin-top: 0!important;
    left: 0!important;
    width: 100%;
    border-radius: 0 0 4px 4px;
    .popper__arrow{
      display: none;
    }
    .el-cascader-menu{
      width: 100%;
    }
    .el-cascader-menu__list {
      padding-left: 15%;
      .el-cascader-node {
        padding-left: 0;
        i{display: none;}
        span{padding-left: 0;}
      }
      .el-cascader-node.is-active{
        color: #FF6A45;
      }
    }
  }
  .my-draw-list{
    .flex{
      display: flex;
      text-align: center;
      .input-box{
        display: inline-block;
        width: 70%;
      }
      .el-input__inner {
        border: none;
        text-align: center;
        color: #FF6A45;
      }
      .el-cascader{
        line-height: 45px;
      }
    }
    .item{
      padding: px2rem(15px) px2rem(30px);
      .flex {
        position: relative;
        border-radius: px2rem(8px);
        padding: px2rem(24px);
        overflow: hidden;
        box-shadow: 0 0 px2rem(16px) #eee;
      }
      .level{
        display: inline-block;
        border: 1px solid #FF6A45;
        border-radius: px2rem(4px);
        color: #FF6A45;
        font-size: px2rem(22px);
        padding: 0 px2rem(10px);
        margin-bottom: px2rem(16px);
      }
      .status {
        position: absolute;
        right: 0;
        top: 0;
        width: px2rem(128px);
      }
      .img-box{
        width: px2rem(160px);
        height: px2rem(160px);
        overflow: hidden;
        border-radius: px2rem(4px);
        margin-right: px2rem(20px);
        img{width: 100%}
      }
      .detail-box{
        text-align: left;
      }
      .title, .desc{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .title{
        color: #333;
        font-size: px2rem(32px);
        line-height: px2rem(42px);
        margin-bottom: px2rem(7px);
      }
      .desc{
        color: #666;
        font-size: px2rem(26px);
        margin-bottom: px2rem(13px);
      }
      .date{
        color: #999;
        font-size: px2rem(24px);
      }
    }
    .scroll-tips {
      text-align: center;
    }
    .mint-loadmore-top{
      // margin-top: 0;
      .loading-box {
        text-align: center;
        .mint-spinner-fading-circle{
          display: inline-block;
          vertical-align: middle;
        }
      }
      .scroll-tips{
        margin-top: 50px;
      }
    }
  }
</style>
