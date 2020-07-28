<template>
  <div class="oneself-submit-wrap">
    <div class="works-no">作品编号：<span class="no-tet">{{noTxt ? noTxt : '暂无'}}</span></div>
    <div class="examine-wrap">
      <div :class="'examine-icon-' + status "></div>
      <div class="status-tips-wait" v-if="status=== 0">作品正在审核中，请耐心等候哦～</div>
      <div class="status-tips-success" v-if="status=== 1">
        <p class="success-tips1">恭喜，审核已通过</p>
        <p class="success-tips2">待投票开始就可以给自己的作品投票/拉票哦</p>
      </div>
      <div class="status-tips-fail" v-if="status=== 2">
        <p class="fail-tips1">审核不通过，被打回</p>
        <p class="fail-tips2">打回原因：{{reason}}</p>
      </div>
      <div class="examine-title-wrap">
        <div class="line"></div>
        <div>作品信息</div>
        <div class="line"></div>
      </div>
      <div class="oneself-content">
        <div class="onself-picture-wrap" v-show="flag === 'picture' && selfData.picture.length">
          <div class="onself-picture-item" v-for="(item, index) in selfData.picture" :key="index">
            <img :src="item.url" />
          </div>
        </div>
        <div class="onself-video-wrap" v-show="flag === 'video' && selfData.video.length">
          <vote-video :data="selfData.video[0]"></vote-video>
        </div>
        <vote-audio v-if="flag === 'audio' && selfData.audio.length" :data="selfData.audio[0]"></vote-audio>
        <div v-show="flag === 'text'" class="onself-text-wrap">{{selfData.desc}}</div>
        <div class="header first-header">
          <span>名称：</span>
          <span class="header-txt">{{selfData.name}}</span>
        </div>
        <div class="header">
          <span>来源：</span>
          <span class="header-txt">{{selfData.source}}</span>
        </div>
        <div class="header" v-show="flag !== 'text'">
          <span>描述：</span>
          <span class="header-txt">{{selfData.desc}}</span>
        </div>
        <div class="header">
          <span>联系人姓名：</span>
          <span class="header-txt">{{selfData.username}}</span>
        </div>
        <div class="header">
          <span>联系人电话：</span>
          <span class="header-txt">{{selfData.phone}}</span>
        </div>
      </div>
    </div>
    <div class="submit-btn-wrap color-button_color" v-if="status === 0" >
      <span class="menu-text color-button_text"
        @click="jumpPage('votesubmit', { flag: flag, id: selfData.id })">修改</span>
    </div>
    <div class="submit-btn-wrap color-button_color" v-if="status === 2" >
      <span class="menu-text color-button_text"
        @click="jumpPage('votesubmit', { flag: flag, id: selfData.id })">重新报名</span>
    </div>
  </div>
</template>

<script>
import VoteVideo from '@/components/vote/global/vote-video'
import VoteAudio from '@/components/vote/global/vote-audio'

export default {
  created () {
    this.initForm()
  },
  components: {
    VoteVideo, VoteAudio
  },
  data () {
    return {
      status: 2, // 0: 审核中 1: 审核通过 2: 审核驳回
      noTxt: '', // 编号
      reason: '素材涉嫌抄袭', // 打回原因
      flag: '', // video/picture/audio/text
      selfData: {
        id: '1',
        desc: `《沁园春·国庆》 万里晴空,壮丽山河，赤旗飘，扬
          看九州方圆,普天同庆; 江河歌唱,遍地流芳。 社会
          稳定，人民幸福，改革开放谱新章。`,
        name: '测试姓名数据',
        source: '测试来源数据',
        username: '联系人测试数据',
        phone: '156xxxx1222',
        picture: [{
          name: '1.png',
          url: 'https://xzvideo.hoge.cn/ce95fb4ce81e4b88881fa8dc8e5ff16c/snapshots/a4ba44b7a95144b7bd1b72fc244718e7-00003.jpg'
        }],
        audio: [{
          name: '1.mp3',
          duration: 161,
          url: 'http://xiaozan-pub.oss-cn-hangzhou.aliyuncs.com/xiuzan/1580901541802/谢昊轩 - 稻香.mp3'
        }],
        video: [{
          name: '1.mp4',
          cover: 'https://xzvideo.hoge.cn/ce95fb4ce81e4b88881fa8dc8e5ff16c/snapshots/a4ba44b7a95144b7bd1b72fc244718e7-00003.jpg',
          url: 'http://outin-a03b512cf3cc11e8acdb00163e1c35d5.oss-cn-shanghai.aliyuncs.com/customerTrans/203182cc86928effd06b285f5532153f/10b9990-1717151ac65-0004-5cb9-006-28284.mov'
        }]
      }
    }
  },
  methods: {
    initForm () {
      console.log('initForm', this.$route.query)
      let { flag } = this.$route.query
      if (flag) {
        this.flag = flag
      }
    },
    jumpPage (page, data) {
      this.$router.push({
        name: page,
        query: data
      })
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .oneself-submit-wrap {
    background-color: #221A6E;
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
      .examine-icon-0 {
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
        @include font-dpr(14px);
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
        color: rgba(255,255,255,0.5);
        .line {
          flex: 1;
          height: px2rem(16px);
          border-bottom: 1px dashed rgba(255,255,255,0.5);
          &:first-child {
            margin-right: px2rem(20px);
          }
          &:last-child {
            margin-left: px2rem(20px);
          }
        }
      }
      .oneself-content {
        .onself-picture-wrap {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          .onself-picture-item {
            position: relative;
            border-radius: px2rem(8px);
            margin: 0 px2rem(20px) px2rem(20px) 0;
            width: px2rem(200px);
            height: px2rem(200px);
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
      background-color: #FC7465;
      .menu-text {
        @include font-dpr(14px);
        color: #fff;
      }
    }
  }
</style>
