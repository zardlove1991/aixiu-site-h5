<template>
  <div class="oneself-submit-wrap">
    <div class="works-no">作品编号：<span class="no-tet">{{selfData.numbering ? selfData.numbering : '暂无'}}</span></div>
    <div class="examine-wrap">
      <div :class="'examine-icon-' + selfData.audit_status"></div>
      <div class="status-tips-wait" v-if="selfData.audit_status === 3">作品正在审核中，请耐心等候哦～</div>
      <div class="status-tips-success" v-if="selfData.audit_status === 1">
        <p class="success-tips1">恭喜，审核已通过</p>
        <p class="success-tips2">待{{textSetting.sign ? textSetting.sign : '投票'}}开始就可以给自己的作品{{textSetting.sign ? textSetting.sign : '投票'}}哦</p>
      </div>
      <div class="status-tips-fail" v-if="selfData.audit_status === 2">
        <p class="fail-tips1">审核不通过，被打回</p>
        <p class="fail-tips2">打回原因：{{selfData.reject_reason}}</p>
      </div>
      <div class="examine-title-wrap">
        <div class="line"></div>
        <div>作品信息</div>
        <div class="line"></div>
      </div>
      <div class="oneself-content">
        <div class="onself-picture-wrap"
          v-if="flag === 'picture' && selfData.material && selfData.material.image && selfData.material.image.length">
          <div :class="['onself-picture-item', imageRatio ? 'vertical' : '']"
            v-for="(item, index) in selfData.material.image" :key="index">
            <img :src="item.url"
              @click.stop="_setPreviewState"
              v-preview="item.url"
              preview-nav-enable="false" />
          </div>
        </div>
        <div class="onself-video-wrap"
          v-if="flag === 'video' && selfData.material && selfData.material.video && selfData.material.video.length">
          <vote-video :isSmall="true" :data="selfData.material.video[0]"></vote-video>
        </div>
        <vote-audio
          v-if="flag === 'audio' && selfData.material && selfData.material.audio && selfData.material.audio.length" :data="selfData.material.audio[0]"></vote-audio>
        <div v-show="flag === 'text'" class="onself-text-wrap">{{selfData.introduce}}</div>
        <div class="header first-header">
          <span>名称：</span>
          <span class="header-txt">{{selfData.name}}</span>
        </div>
        <div class="header" v-if="isOpenClassify">
          <span v-if="id === '0e6e35cd3c234e02bb1137d56b6d94f8'">选择市及县区：</span>
          <span v-else>分类：</span>
          <span class="header-txt">{{selfData.type_name}}</span>
        </div>
        <div class="header">
          <span v-if="id === '0e6e35cd3c234e02bb1137d56b6d94f8'">乡镇及行政村：</span>
          <span v-else>来源：</span>
          <span class="header-txt">{{selfData.source}}</span>
        </div>
        <div class="header" v-show="flag !== 'text'">
          <span>描述：</span>
          <span class="header-txt">{{selfData.introduce}}</span>
        </div>
        <div class="header">
          <span>联系人姓名：</span>
          <span class="header-txt">{{selfData.contact_name}}</span>
        </div>
        <div class="header">
          <span>联系人电话：</span>
          <span class="header-txt">{{selfData.contact_phone}}</span>
        </div>
      </div>
    </div>
    <!-- <div class="submit-btn-wrap color-button_color"
      v-if="selfData.audit_status === 3"
      @click="jumpPage('votesubmit', { worksId: selfData.id })">
      <span class="menu-text color-button_text">修改</span>
    </div> -->
    <div class="submit-btn-wrap color-button_color"
      v-if="selfData.audit_status === 2"
      @click="jumpPage('votesubmit', { worksId: selfData.id })">
      <span class="menu-text color-button_text">重新报名</span>
    </div>
  </div>
</template>

<script>
import VoteVideo from '@/components/vote/global/vote-video'
import VoteAudio from '@/components/vote/global/vote-audio'
import API from '@/api/module/examination'
import SubjectMixin from '@/mixins/subject'
import STORAGE from '@/utils/storage'

export default {
  mixins: [ SubjectMixin ],
  created () {
    this.initForm()
  },
  props: {
    id: String,
    flag: String
  },
  components: {
    VoteVideo, VoteAudio
  },
  data () {
    return {
      selfData: {},
      textSetting: {},
      isOpenClassify: false,
      imageRatio: 0 // 图片模式
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
        // 判断图片模式
        let pageSetup = detailInfo.rule.page_setup
        if (pageSetup.image_ratio) {
          this.imageRatio = 1
        } else {
          this.imageRatio = 0
        }
      }
    },
    initForm () {
      this.initDetail()
      API.getReportDetail({
        query: {
          id: this.id
        }
      }).then(res => {
        if (!res) {
          return
        }
        this.selfData = res
      })
    },
    jumpPage (page, data) {
      let params = {
        flag: this.flag,
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
  .oneself-submit-wrap {
    // background-color: #221A6E;
    // @include bg-color('bgColor');
    padding: px2rem(47px) px2rem(30px) px2rem(30px) px2rem(30px);
    min-height: 100vh;
    .works-no {
      @include font-dpr(14px);
      color: rgba(255, 255, 255, 0.5);
      .no-tet {
        color: #fff;
      }
    }
    .examine-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .examine-icon-3 {
        margin: px2rem(60px) 0;
        width: px2rem(150px);
        height: px2rem(181px);
        @include img-retina("~@/assets/vote/examine-load@2x.png","~@/assets/vote/examine-load@3x.png", 100%, 100%);
      }
      .examine-icon-1 {
        margin: px2rem(60px) 0 px2rem(45px) 0;
        width: px2rem(150px);
        height: px2rem(150px);
        @include img-retina("~@/assets/vote/examine-yes@2x.png","~@/assets/vote/examine-yes@3x.png", 100%, 100%);
      }
      .examine-icon-2 {
        margin: px2rem(60px) 0 px2rem(45px) 0;
        width: px2rem(150px);
        height: px2rem(150px);
        @include img-retina("~@/assets/vote/examine-no@2x.png","~@/assets/vote/examine-no@3x.png", 100%, 100%);
      }
      .status-tips-wait {
        @include font-dpr(15px);
        color: #FFFFFF;
      }
      .status-tips-success {
        text-align: center;
        line-height: px2rem(50px);
        .success-tips1 {
          @include font-dpr(15px);
          color: #FFFFFF;
          font-weight: 500;
        }
        .success-tips2 {
          @include font-dpr(14px);
          color: rgba(255, 255, 255, 0.6);
        }
      }
      .status-tips-fail {
        text-align: center;
        line-height: px2rem(60px);
        @include font-dpr(15px);
        .fail-tips1 {
          color: #FFFFFF;
          font-weight: 500;
        }
        .fail-tips2 {
          color: #FF6A45;
        }
      }
      .examine-title-wrap {
        margin-top: px2rem(60px);
        margin-bottom: px2rem(60px);
        display: flex;
        width: 100%;
        height: px2rem(33px);
        line-height: px2rem(33px);
        @include font-dpr(12px);
        color: rgba(255,255,255,0.4);
        .line {
          flex: 1;
          height: px2rem(16px);
          border-bottom: 1px dashed rgba(255,255,255,0.4);
          &:first-child {
            margin-right: px2rem(20px);
          }
          &:last-child {
            margin-left: px2rem(20px);
          }
        }
      }
      .oneself-content {
        width: 100%;
        .onself-picture-wrap {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          .onself-picture-item {
            position: relative;
            margin: 0 px2rem(20px) px2rem(20px) 0;
            width: px2rem(200px);
            height: px2rem(200px);
            &.vertical {
              width: 6.25rem;
              height: calc(6.25rem * 5.6 / 4);
            }
            img {
              border-radius: px2rem(8px);
            }
          }
        }
        .onself-video-wrap {
          width: px2rem(470px);
          height: px2rem(260px);
        }
        .onself-text-wrap {
          @include font-dpr(15px);
          color: #fff;
        }
        .header {
          margin-bottom: px2rem(20px);
          @include font-dpr(14px);
          color: rgba(255, 255, 255, 0.5);
          display: flex;
          &.first-header {
            margin-top: px2rem(40px);
          }
          span {
            display: inline-block;
          }
          .header-txt {
            flex: 1;
            color: #fff;
          }
        }
      }
    }
    .submit-btn-wrap {
      margin-top: px2rem(30px);
      height: px2rem(80px);
      line-height: px2rem(80px);
      text-align: center;
      border-radius: px2rem(8px);
      // background-color: #FC7465;
      @include bg-color('btnColor');
      .menu-text {
        @include font-dpr(14px);
        color: #fff;
      }
    }
  }
</style>
