<template>
  <div class="commvote-mine">
    <vote-fullscene-list
      v-if="fullSceneType && fullSceneType.length"
      class="vote-my-fullscene"
      :searchVal="checkFullScene"
      :darkMark="darkMark"
      :fullSceneType="fullSceneType"
      @fullSceneChange="fullSceneChange">
    </vote-fullscene-list>
    <my-page-empty v-if="mineArr && !mineArr.length" :tip="tip"></my-page-empty>
    <!--列表渲染-->
    <div v-else class="mine-list-wrap">
      <div class="mine-list-item"
        v-for="(list, key, index) in mineList" :key="index">
        <div :class="['date-tip', darkMark === '2' ? 'light' : '']">
          <i class="examfont iconriqi"></i>
          <span class="tip">{{key}}</span>
        </div>
        <div
          :class="['list-item',
          (item.image_ratio && showModel === 'picture') ? 'picture-vertical' : '',
          (videoMode === '3' && showModel === 'video') ? 'video-vertical' : '']"
          v-for="(item, idx) in list" :key="idx"
          @click.stop="jumpPage('votedetail', { worksId: item.works_id }, {type: item.works.voting_type, introduce:item.works.introduce})">
          <div :class="['list-item-line', darkMark === '2' ? 'light': '']"></div>
          <div class="item-indexpic"
            v-if="showModel === 'picture' && item.works.material && item.works.material.image && item.works.material.image.length"
            :style="{ backgroundImage: 'url(' + item.works.material.image[0].url + '?x-oss-process=image/resize,w_400)'}"></div>
          <div class="item-indexpic video-wrap"
            v-if="showModel === 'video' && item.works.material && item.works.material.video && item.works.material.video.length"
            :style="{ backgroundImage: `url(${item.works.material.video[0].cover_image ? item.works.material.video[0].cover_image : item.works.material.video[0].cover}?x-oss-process=image/resize,w_400)` }">
            <div class="play-icon"></div>
          </div>
          <div v-if="showModel === 'audio'" :class="['audio-play-icon', darkMark === '2' ? 'light' : '']">
            <div class="audio-icon"></div>
          </div>
          <div class="item-content">
            <div class="content-title">
              <div class="content-title-txt">{{item.works.name}}</div>
            </div>
            <p class="content-desc">截止{{item.showdate}}<span class="vote-tip">累计{{firstUnit}}<i class="vote-num">{{item.total}}</i>{{signUnit}}</span></p>
          </div>
        </div>
      </div>
      <div v-if="!noMore" class="scroll-tips" @click="initMyVoteList()">点击我，加载更多</div>
      <div v-if="loading" class="scroll-tips">加载中...</div>
    </div>
    <!--当前返回组件-->
    <common-pageback-btn :id="id"></common-pageback-btn>
</div>
</template>

<script>
import MyPageEmpty from '@/components/vote/global/my-page-empty'
import CommonPagebackBtn from '@/components/vote/global/common-pageback-btn'
import VoteFullsceneList from '@/components/vote/global/vote-fullscene-list'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import { fullSceneMap } from '@/utils/config'

export default {
  data () {
    return {
      showModel: this.flag,
      mineList: {},
      mineArr: [],
      loading: false,
      pager: {
        total: 0,
        page: 0,
        count: 10,
        totalPages: 0
      },
      firstUnit: '投了',
      signUnit: '票',
      tip: '暂无列表记录',
      videoMode: '1', // 视频展示模式 1: 横屏1行1个 2: 横屏1行2个 3: 竖屏1行2个
      darkMark: '1', // 1: 深色系 2: 浅色系
      checkFullScene: '', // 选中的全场景
      fullSceneType: [], // 全场景的搜索条件
      fullSceneMap
    }
  },
  props: {
    id: String,
    flag: String
  },
  components: {
    MyPageEmpty, CommonPagebackBtn, VoteFullsceneList
  },
  created () {
    this.initDetail()
    this.initMyVoteList()
  },
  computed: {
    noMore () {
      // 当起始页数大于总页数时停止加载
      let { page, totalPages } = this.pager
      return page >= totalPages
    }
  },
  methods: {
    initDetail () {
      let detailInfo = STORAGE.get('detailInfo')
      if (detailInfo) {
        let rule = detailInfo.rule
        let limit = rule.limit
        if (limit && limit.show_mode) {
          this.videoMode = limit.show_mode
        }
        if (rule.page_setup && rule.page_setup.font_color) {
          this.darkMark = rule.page_setup.font_color
        }
        if (detailInfo.text_setting) {
          let sign = detailInfo.text_setting.sign
          let tmp = sign.split('')
          this.tip = '暂无' + sign + '记录'
          if (tmp.length >= 2) {
            let signUnit = tmp[1]
            if (signUnit !== '票') {
              this.firstUnit = sign
              this.signUnit = '次'
            } else {
              this.firstUnit = '投了'
              this.signUnit = '票'
            }
          }
        }
        if (detailInfo.mark === 'commonvote-fullscene') {
          let arr = limit.full_scene_type
          if (arr && arr.length) {
            let key = arr[0]
            this.fullSceneType = arr
            this.checkFullScene = key
            this.showModel = this.fullSceneMap[key][1]
          }
        }
      }
    },
    initMyVoteList () {
      let voteId = this.id
      this.loading = true
      let { page, count } = this.pager
      let params = {
        voting_id: voteId,
        page: page + 1,
        count
      }
      if (this.checkFullScene) {
        params.full_scene_type = this.checkFullScene
      }
      API.getMineVoteList({
        params
      }).then(res => {
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
          totalPages = parseInt(total / count) + 1
        }
        this.mineArr = this.mineArr.concat(data)
        let mineList = this.mineList
        for (let item of data) {
          let dateKey = item.create_time ? item.create_time.split(' ')[0] : '未知'
          let dateArr = mineList[dateKey] || [] // 声明对象为原数组或者初始化为空
          // 存放数据
          let limtIndex = item.create_time.indexOf('-')
          item.showdate = limtIndex > 0 ? item.create_time.substr(limtIndex + 1) : '暂无'
          dateArr.push(item)
          mineList[dateKey] = dateArr
        }
        // 赋值
        this.mineList = mineList
        this.pager = { total, page, count, totalPages }
        this.loading = false
      })
    },
    jumpPage (page, data, promiss) {
      if (promiss && promiss.type === 'commonvote-text' && !promiss.introduce) {
        return false
      }
      this.$router.push({
        name: page,
        params: {
          id: this.id,
          flag: this.showModel
        },
        query: data
      })
    },
    fullSceneChange (key) {
      console.log('fullSceneChange', key)
      this.checkFullScene = key
      this.showModel = this.fullSceneMap[key][1]
      this.mineList = {}
      this.mineArr = []
      this.pager = {
        total: 0,
        page: 0,
        count: 10,
        totalPages: 0
      }
      this.initMyVoteList()
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/components/vote/base.scss";
  .commvote-mine {
    // background-color: #221A6E;
    // @include bg-color('bgColor');
    min-height: 100vh;
    .vote-my-fullscene {
      margin: px2rem(30px) px2rem(30px) 0 px2rem(30px);
    }
    .mine-list-wrap {
      padding: px2rem(40px) px2rem(30px);
      .mine-list-item {
        margin-bottom: px2rem(40px);
        &:last-child {
          margin-bottom: 0;
        }
        .date-tip {
          display: flex;
          align-items: center;
          font-size: px2rem(28px);
          color: #fff;
          &.light {
            @include font-color('descColor');
          }
          .iconriqi {
            margin-right: px2rem(25px);
          }
        }
        .list-item {
          position: relative;
          padding: px2rem(30px) 0;
          padding-right: px2rem(30px);
          display: flex;
          align-items: center;
          // border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          .list-item-line {
            position: absolute;
            left: 0;
            bottom: 0;
            right: 0;
            top: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            &.light {
              @include border('bottom', 1px, solid, 'descColor');
              opacity: 0.15;
            }
          }
          &.picture-vertical, &.video-vertical {
            .item-indexpic {
              height: px2rem(252px);
            }
            .item-indexpic.video-wrap {
              height: px2rem(270px);
            }
          }
          .item-indexpic {
            position: relative;
            flex: 0 0 px2rem(180px);
            width: px2rem(180px);
            height: px2rem(102px);
            border-radius: px2rem(4px);
            background-repeat: no-repeat;
            background-size: cover;
            background-position: left top;
            margin-right: px2rem(20px);
            .play-icon {
              position: absolute;
              top: 50%;
              left: 50%;
              width: px2rem(23px);
              height: px2rem(26px);
              background-repeat: no-repeat;
              background-position: center;
              background-size: cover;
              background-image: url('https://xzh5.hoge.cn/new-vote/images/play_icon@2x.png');
              background-image: image-set(url('https://xzh5.hoge.cn/new-vote/images/play_icon@2x.png') 1x, url('https://xzh5.hoge.cn/new-vote/images/play_icon@3x.png') 2x);
              transform: translate3d(-50%, -50%, 0);
            }
          }
          .audio-play-icon {
            margin-right: px2rem(20px);
          }
          .item-content {
            .content-title {
              display: flex;
              align-items: center;
              margin-bottom: px2rem(10px);
              .content-title-txt {
                @include font-color('fontColor');
                font-size: px2rem(30px);
                @include txt-overflow(px2rem(490px));
              }
            }
            .content-desc {
              display: flex;
              align-items: center;
              font-size: px2rem(24px);
              @include font-color('fontColor');
              opacity: 0.7;
              .vote-tip {
                margin-left: 4px;
              }
              .vote-num {
                font-size: px2rem(28px);
                font-style: normal;
                margin:0 5px;
              }
            }
          }
        }
      }
    }
    .scroll-tips {
      width: 100%;
      @include font-dpr(14px);
      color:#ccc;
      text-align: center;
    }
  }
</style>
