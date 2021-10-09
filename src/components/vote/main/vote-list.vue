<template>
  <div :class="['voteList-submit-wrap', darkMark === '2' ? 'light' : '']">
    <div class="voteList-wrap">
        <div class="voteList"
            :class="{'autoHeight' : !is_open_enroll_limit}"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            :infinite-scroll-immediate-check="true"
            infinite-scroll-distance="10">
            <div v-for="(v,key) in dateArr" :key="key">
                <div class="date-icon"></div>
                <span class="format_time">{{v}}</span>
                <div class="data" v-for="item in selfData.get(v)" :key="item.numbering"  @click="jumpPage('voteoneself', { worksId: item.id })">
                  <div class="data-wrap" v-if="item.material.image.length">
                      <img v-lazy="item.material.image[0].url" alt="">
                      <div class="detail">
                        <span class="create_time">{{item.create_time}}上传了作品</span>
                        <div class="introduce" v-if="item.introduce">{{item.introduce}}</div>
                        <div class="status-icon adopt-icon" v-if="item.audit_status == 1"><span>已通过</span></div>
                        <div class="status-icon reject-icon" v-if="item.audit_status == 2"><span>被打回</span></div>
                        <div class="status-icon audit-icon" v-if="item.audit_status == 3"><span>审核中</span></div>
                      </div>
                  </div>
                  <div class="data-wrap" v-if="item.material.video.length">
                      <img v-lazy="item.material.video[0].cover" alt="">
                      <div class="detail">
                        <span class="create_time">{{item.create_time}}上传了作品</span>
                        <div class="introduce" v-if="item.introduce">{{item.introduce}}</div>
                        <div class="status-icon adopt-icon" v-if="item.audit_status == 1"><span>已通过</span></div>
                        <div class="status-icon reject-icon" v-if="item.audit_status == 2"><span>被打回</span></div>
                        <div class="status-icon audit-icon" v-if="item.audit_status == 3"><span>审核中</span></div>
                      </div>
                  </div>
                </div>
            </div>
        </div>
    </div>
    <div class="submit-btn-wrap color-button_color"
      v-if="is_open_enroll_limit"
      @click="jumpPage('votesubmit', { worksId: selfData.id })">
      <span class="menu-text color-button_text">继续报名</span>
    </div>
  </div>
</template>

<script>
import VoteVideo from '@/components/vote/global/vote-video'
import VoteAudio from '@/components/vote/global/vote-audio'
import API from '@/api/module/examination'
import SubjectMixin from '@/mixins/subject'
import STORAGE from '@/utils/storage'
import { fullSceneMap } from '@/utils/config'
import { InfiniteScroll, Lazyload } from 'mint-ui'

export default {
  mixins: [ SubjectMixin ],
  name: 'voteList',
  created () {
    this.initDetail()
    this.initForm()
  },
  props: {
    id: String,
    flag: String
  },
  components: {
    VoteVideo, VoteAudio, InfiniteScroll, Lazyload
  },
  data () {
    return {
      showModel: this.flag,
      colorName: '', // 配色名称
      selfData: new Map([]),
      dateArr: [],
      textSetting: {},
      isOpenClassify: false,
      imageRatio: 0, // 图片模式
      videoMode: '1', // 视频展示模式 1: 横屏1行1个 2: 横屏1行2个 3: 竖屏1行2个
      darkMark: '1', // 1: 深色系 2: 浅色系
      fullSceneMap,
      is_open_enroll_limit: '',
      loading: false,
      count: 10,
      page: 1
    }
  },
  methods: {
    initDetail () {
      let detailInfo = STORAGE.get('detailInfo')
      if (detailInfo) {
        if (detailInfo.text_setting) {
          this.textSetting = detailInfo.text_setting
        }
        let limit = detailInfo.rule.limit
        if (limit.is_open_classify && limit.is_open_classify === 1) {
          this.isOpenClassify = true
        }
        if (limit.show_mode) {
          this.videoMode = limit.show_mode
        }
        // 控制用户是否可以多次报名
        if (limit.is_open_enroll_limit) {
          this.is_open_enroll_limit = limit.is_open_enroll_limit
        }
        // 判断图片模式
        let pageSetup = detailInfo.rule.page_setup
        if (pageSetup.image_ratio) {
          this.imageRatio = 1
        } else {
          this.imageRatio = 0
        }
        if (pageSetup.font_color) {
          this.darkMark = pageSetup.font_color
        }
        if (pageSetup.color_scheme) {
          this.colorName = pageSetup.color_scheme.name
        }
      }
    },
    loadMore () {
      this.loading = true
      this.page++
      this.initForm()
    },
    initForm () {
      let detailInfo = STORAGE.get('detailInfo')
      API.getReportDetail({
        query: {
          id: this.id
        },
        params: {
          works_id: 'all',
          count: this.count,
          page: this.page
        }
      }).then(res => {
        if (!res) {
          return
        }
        let fullSceneType = res.full_scene_type
        if (fullSceneType && fullSceneType !== '0') {
          this.showModel = this.fullSceneMap[fullSceneType][1]
        }
        // 控制用户多次报名的次数
        if (this.is_open_enroll_limit) {
          this.enroll_limit_MaxNum = detailInfo.rule.limit.enroll_limit_MaxNum
          this.is_open_enroll_limit = res.data.length < this.enroll_limit_MaxNum
        }
        res.data.forEach(item => (item.format_time = item.create_time.split(' ')[0]))
        this.dateArr = [...new Set(res.data.map(item => item.format_time).concat(this.dateArr))].sort((a, b) => {
          return +new Date(b) - +new Date(a)
        })
        this.dateArr.forEach(item => {
          if (!this.selfData.has(item)) {
            this.selfData.set(item, [])
          }
        })
        res.data.forEach(item => {
          this.selfData.get(item.format_time).push(item)
        })
        if (res.last_page > this.page) {
          this.loading = false
        }
      })
    },
    jumpPage (page, data) {
      let params = {
        flag: this.showModel,
        id: this.id
      }
      this.$router.push({
        name: page,
        params,
        query: data
      })
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .voteList-submit-wrap {
    // background-color: #221A6E;
    // @include bg-color('bgColor');
    padding: px2rem(47px) px2rem(30px) px2rem(30px) px2rem(30px);
    min-height: 100vh;
    .works-no {
      @include font-dpr(14px);
      color: rgba(255, 255, 255, 0.5);
      .no-tet {
        @include font-color('fontColor');
      }
    }
    .voteList-wrap {
      display: flex;
      flex-direction: column;
      .voteList {
          // height: px2rem(1050px);
          height: 88vh;
          overflow-y: auto;
          .data {
            width: 100%;
            height: px2rem(180px);
            margin-bottom: px2rem(36px);
            border-radius: px2rem(24px);
            box-shadow: 0 px2rem(8px) px2rem(28px) 0 rgba(0, 0, 0, 0.06);
            @include bg-color('bgGrayColor');
            .data-wrap {
                display: flex;
                padding: px2rem(30px);
                position: relative;
                .detail {
                    margin-left: px2rem(20px);
                    .create_time {
                        font-size: px2rem(24px);
                        color: #000;
                        font-weight: 500;
                    }
                    .introduce {
                        font-weight: 400;
                        font-size: px2rem(28px);
                        color: #666;
                        margin-top: px2rem(20px);
                    }
                    .status-icon {
                        width: px2rem(128px);
                        height: px2rem(44px);
                        position: absolute;
                        right: 0;
                        top: 0;
                        span {
                          font-size: px2rem(22px);
                          position: absolute;
                          right: px2rem(18px);
                          top: px2rem(5px);
                        }
                    }
                    .adopt-icon {
                        @include img-retina("~@/assets/vote/adopt.png","~@/assets/vote/adopt@2x.png", 100%, 100%);
                        color: #21CAB8;
                    }
                    .reject-icon {
                        @include img-retina("~@/assets/vote/reject.png","~@/assets/vote/reject@2x.png", 100%, 100%);
                        color: #FF6A45;
                    }
                    .audit-icon {
                        @include img-retina("~@/assets/vote/audit.png","~@/assets/vote/audit@2x.png", 100%, 100%);
                        color: #FFB138;
                    }
                }
            }
            img {
                width: px2rem(120px);
                height: px2rem(120px);
                border-radius: px2rem(8px);
            }
          }
          .format_time {
            font-size: px2rem(28px);
            color: #FF572A;
            display: inline-block;
            margin-bottom: px2rem(30px);
          }
          .date-icon {
            width: px2rem(28px);
            height: px2rem(26px);
            float: left;
            margin-right: px2rem(16px);
            @include img-retina("~@/assets/vote/date.png","~@/assets/vote/date@2x.png", 100%, 100%);
          }
      }
      .autoHeight {
        height: 95vh;
      }
    }
    .submit-btn-wrap {
      margin-top: px2rem(30px);
      height: px2rem(80px);
      line-height: px2rem(80px);
      text-align: center;
      border-radius: px2rem(8px);
      position: fixed;
      bottom: px2rem(40px);
      width: 90%;
      transform: translateX(-50%);
      left: 50%;
      // background-color: #FC7465;
      @include bg-color('btnColor');
      .menu-text {
        @include font-dpr(14px);
        color: #fff;
      }
    }
  }
</style>
