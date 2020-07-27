<template>
  <div class="vote-start-wrap">
    <div :class="['commvote-overview', 'color-bg_color', status !== 3 ? 'status-no-end' : '']">
      <!--背景标题-->
      <div v-if="detailInfo.indexpic"
        :class="['overview-indexpic-wrap', 'color-bg_color', (!detailInfo.indexpic || !detailInfo.indexpic.filename) ? 'nopic-wrap' : '']">
        <div class="pic-thumb"
          :class="{
            nopic: !detailInfo.indexpic || !detailInfo.indexpic.filename,
            haspic: detailInfo.indexpic && detailInfo.indexpic.filename
          }">
          <div v-if="detailInfo.indexpic && detailInfo.indexpic.filename" class="pic-indexpic"
            :style="{ backgroundImage: 'url(' + detailInfo.indexpic.host + detailInfo.indexpic.filename + ')'}"></div>
          <div v-if="detailInfo.subject" class="pic-title color-high_text color-decorated">{{detailInfo.subject}}</div>
        </div>
      </div>
      <div v-else class="overview-indexpic-empty"></div>
      <!--当前机构描述-->
      <div class="overview-organizers"
          v-if="detailInfo.organizers.length"
          :class="{ nointroduce: !detailInfo.introduce }">
          <span class="name color-high_text" v-for="(item, index) in detailInfo.organizers" :key="index">{{item.name}}</span>
      </div>
      <!--主要内容包裹-->
      <div class="overview-content-wrap" :style="{ paddingTop: detailInfo.introduce ? 0 : '0.64rem' }">
        <!--当前活动描述-->
        <div class="overview-introduce" v-show="detailInfo.introduce">
          <div class="intro-title color-theme_color">活动规则</div>
          <p class="intro-desc color-theme_color" :class="{'show': isShowAllIntro}">{{detailInfo.introduce}}</p>
          <div class="intro-showall-wrap"
            @click.stop="isShowAllIntro = !isShowAllIntro"
            v-if="showButton">
            <span class="showall-text color-theme_color">查看全部</span>
            <span class="showall-arrow color-theme_color" :class="{'show': isShowAllIntro}"></span>
          </div>
        </div>
        <!--信息展示-->
        <div class="overview-vote-wrap" v-if="detailInfo.interact_data_display && status !== 1">
          <div :class="['vote-cols-wrap', 'color-content', showModel + '-text']">
            <span class="vote-count color-normal_text">{{detailInfo.works_count}}</span>
            <span class="vote-desc color-normal_text">作品数</span>
          </div>
          <div class="vote-cols-wrap color-content">
            <span class="vote-count color-normal_text">{{detailInfo.votes}}</span>
            <span class="vote-desc color-normal_text">总票数</span>
          </div>
          <div class="vote-cols-wrap color-content">
            <span class="vote-count color-normal_text">{{detailInfo.views_count}}</span>
            <span class="vote-desc color-normal_text">访问次数</span>
          </div>
        </div>
        <div class="overview-vote-wrap" v-if="detailInfo.interact_data_display && status === 1">
          <div class="vote-cols-wrap color-content signup-icon">
            <span class="vote-count color-normal_text">{{detailInfo.works_count}}</span>
            <span class="vote-desc color-normal_text">报名次数</span>
          </div>
          <div class="vote-cols-wrap color-content examine-icon">
            <span class="vote-count color-normal_text">{{detailInfo.votes}}</span>
            <span class="vote-desc color-normal_text">已通过审核</span>
          </div>
          <div class="vote-cols-wrap color-content">
            <span class="vote-count color-normal_text">{{detailInfo.views_count}}</span>
            <span class="vote-desc color-normal_text">访问次数</span>
          </div>
        </div>
        <!--菜单-->
        <div class="overview-menus-wrap" v-if="status !== 1">
          <div class="menu-wrap menu-right color-button_color" @click.stop="jumpPage('voterank')">
            <i class="examfont iconjiangbei rank color-button_text"></i>
            <span class="menu-text color-button_text">榜单</span>
          </div>
          <div class="menu-wrap color-button_color" @click.stop="jumpPage('votemy')">
            <i class="examfont iconwodetoupiao mine color-button_text"></i>
            <span class="menu-text color-button_text">我的投票</span>
          </div>
        </div>
        <div class="overview-menus-wrap" v-if="status === 1">
          <div class="menu-wrap color-button_color" @click="jumpPage('votesubmit', { flag: showModel })">
            <span class="menu-text color-button_text">{{ isExamine ? '查看我的作品' : '立即报名'}}</span>
          </div>
        </div>
        <div class="overview-list-title-wrap">
          <div class="line"></div>
          <div>作品列表</div>
          <div class="line"></div>
        </div>
        <!--搜索条-->
        <div class="overview-search-bar-wrap color-component">
          <input class="search-input" type="text" placeholder="请输入作品名称/来源/编号" v-model="searchVal"
              @focus.stop="searchBarFocus = true" @blur.stop="searchBarFocus = false" />
          <div class="search-icon" :class="{ 'focus': searchBarFocus }" @click.stop="dealSearch">
          </div>
        </div>
      </div>
      <vote-picture-text @jump-page="jumpPage"></vote-picture-text>
      <vote-video-text @jump-page="jumpPage"></vote-video-text>
      <vote-audio-text @jump-page="jumpPage"></vote-audio-text>
      <vote-text @jump-page="jumpPage"></vote-text>
    </div>
    <div class="active-rule-wrap default" @click="isShowRuleDialog = true">活动规则</div>
    <count-down :status="status" :obj="detailInfo"></count-down>
    <tips-dialog
      :show="isShowRuleDialog"
      @close="isShowRuleDialog = false">
      <div class="rule-dialog-wrap" slot="tips-content">
        <div class="rule-header">活动规则</div>
        <div class="rule-content">
          <p v-for="(rule, index) in rules" :key="index">{{index + 1}}. {{rule}}</p>
        </div>
      </div>
    </tips-dialog>
  </div>
</template>

<script>
import VotePictureText from '@/components/vote/list/vote-picture-text'
import VoteVideoText from '@/components/vote/list/vote-video-text'
import VoteAudioText from '@/components/vote/list/vote-audio-text'
import VoteText from '@/components/vote/list/vote-text'
import CountDown from '@/components/vote/global/count-down'
import TipsDialog from '@/components/vote/global/tips-dialog'

export default {
  components: {
    VotePictureText, VoteVideoText, VoteAudioText, VoteText, CountDown, TipsDialog
  },
  data () {
    return {
      searchVal: '',
      searchBarFocus: false,
      isShowAllIntro: false,
      isShowRuleDialog: false,
      showButton: true,
      showModel: 'text',
      status: 1, // 0: 未开始 1: 报名中 2: 投票中 3: 已结束
      isExamine: 0, // 0 未报名 1 已报名
      rules: [
        '每天每个微信号可投票十票，投票后点击此链接幸运抽奖，进入抽奖页面。',
        '粉丝福利抽奖活动将于9月30日开始'
      ],
      'detailInfo': {
        'id': '431531aa9edd45d0981284961de9fd05',
        'title': '图片+文本投票组件',
        'indexpic': {
          'host': '//xzimg.hoge.cn/',
          'filename': 'xiuzan/1593413360885/9A86E5BA203CC6FA06EB7864A4CDA521.jpg',
          'format': '.jpg',
          'width': 1440,
          'height': 1920,
          'filesize': 457651
        },
        'organizers': [{
          name: '张三'
        }, {
          name: '李四'
        }],
        'start_time': 1594224000,
        'end_time': 1596038400,
        'introduce': '活动规则及介绍活动规则及介绍活动规则及介绍活动规则及介绍活动规则及介绍活动规则及介绍活动规则及介绍活动规则及介绍活动规则及介绍活动规则及介绍活动规则及介绍活动规则及介绍活动规则及介绍活动规则及介绍',
        'user_id': 3,
        'create_time': '2020-07-09 16:10:10',
        'update_time': '2020-07-09 16:10:10',
        'subject': '图文投票',
        'mark': 'commonvote-image',
        'works_count': 2,
        'record_count': 0,
        'views_count': 102,
        'interact_data_display': 1,
        'votes': 0,
        'rule': {
          'id': 673,
          'voting_id': '431531aa9edd45d0981284961de9fd05',
          'interact_data': {
            'is_display': 0,
            'views': 100,
            'votes': 0,
            '_is_display': '0'
          },
          'is_user_limit': 1,
          'user_limit_times': 5,
          'user_limit_unit': 0,
          'is_works_limit': 1,
          'works_limit_times': 1,
          'is_total_limit': 1,
          'total_limit_times': 1,
          'max_increment': 0,
          'unlock_duration': 60,
          'extra_config': []
        }
      }
    }
  },
  methods: {
    dealSearch () {
      console.log('dealSearch')
    },
    jumpPage (page, data) {
      this.$router.replace({
        name: page,
        query: data
      })
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .vote-start-wrap {
    .active-rule-wrap {
      position: fixed;
      z-index: 10;
      right: 0;
      bottom: 30%;
      width: px2rem(57px);
      height: px2rem(220px);
      color: #fff;
      font-size: px2rem(26px);
      line-height: px2rem(32px);
      padding: 0 px2rem(15px);
      display: flex;
      align-items: center;
      &.default {
        @include img-retina('~@/assets/vote/active-rule-default@2x.png','~@/assets/vote/active-rule-default@3x.png', 100%, 100%);
      }
    }
    .commvote-overview {
      background-color: #221A6E;
      transform: translateX(0);
      &.status-no-end {
        padding-bottom: px2rem(200px);
      }
      .overview-indexpic-wrap {
        position: relative;
        width: 100%;
        height: px2rem(500px);
        overflow: hidden;
        &.nopic-wrap {
          height: px2rem(160px);
        }
        .pic-thumb {
          position: relative;
          .pic-indexpic {
            width: 100vw;
            height: 100%;
            transform: translateX(27.5%);
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
          }
          .pic-title {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: calc(100vw - 35px);
            padding: px2rem(22px) px2rem(45px);
            padding-bottom: px2rem(10px);
            text-align: center;
            background: linear-gradient(90deg, rgba(91, 74, 188, 1) 0%, rgba(69, 67, 186, 1) 100%);
            border-radius: px2rem(16px) px2rem(16px) 0 0;
            box-sizing: border-box;
            font-weight: 500;
            color: #fff;
            @include font-dpr(22px);
            @include line-overflow(1);
          }
          ::after {
            box-shadow: 0 0 20px 3px rgba(0, 0, 0, 0.3) inset;
            content: "";
          }
        }
        .pic-thumb, .pic-thumb::after {
          position: absolute;
          bottom: 0;
          width: 155%;
          left: -27.5%;
          height: 100%;
          border-radius: 0 0 50% 50%;
          overflow: hidden;
          box-shadow: 0 3px 25px 3px rgba(0, 0, 0, 0.1);
        }
        .pic-thumb.haspic {
          .pic-indexpic {
            transform: translateX(51%);
          }
          .pic-title {
            transform: translateX(-48.8%);
          }
        }
        .pic-thumb.haspic, .pic-thumb.haspic::after{
          width: 200%;
          left:-51%;
        }
        .pic-thumb.nopic, .pic-thumb.nopic::after {
          height: 200%;
        }
      }
      .overview-organizers {
        width: 100%;
        padding: px2rem(30px);
        text-align: center;
        line-height: px2rem(30px);
        &.nointroduce{
          padding: 0.48rem 0.3rem 1rem;
        }
        .name {
          position: relative;
          display: inline-block;
          font-size: px2rem(30px);
          color: #fff;
          padding-right: 8px;
          margin-right: 6px;
          vertical-align: top;
          &::after {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 10px;
            background-color: rgba(255, 255, 255, 0.2);
            content: "";
          }
          &:last-child {
            margin-right: 0;
            padding-right: 0;
          }
          &:last-child::after {
            display: none;
          }
        }
      }
      .overview-content-wrap {
        width: 100%;
        padding: 0 px2rem(30px) px2rem(30px) px2rem(30px);
        box-sizing: border-box;
        .overview-introduce {
          width: 100%;
          padding: 0.64rem 0 1rem;
          box-sizing: border-box;
          .intro-title {
            @include font-dpr(17px);
            font-weight: bold;
            color: #fff;
            line-height: 1;
            margin-bottom: 0.26rem;
          }
          .intro-desc {
            @include font-dpr(15px);
            color: #fff;
            line-height: 24px;
            white-space: pre-line;
            max-height: calc(24px * 3);
            overflow: hidden;
            &.show {
              max-height: none;
              overflow: auto;
            }
          }
          .intro-showall-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.3rem 0 0.13rem;
            line-height: 0.3rem;
            text-align: center;
            opacity: 0.7;
            .showall-text {
              display: inline-block;
              font-size: 12px;
              color: #fff;
              line-height: 1;
              margin-right: 5px;
              vertical-align: top;
            }
            .showall-arrow {
              position: relative;
              top: 0;
              display: inline-block;
              width: 5px;
              height: 5px;
              border: 1px solid #fff;
              border-top: none;
              border-left: none;
              transform: rotate(45deg);
              vertical-align: top;
              transition: transform 0.3s ease;
              &.show {
                position: relative;
                top: 2px;
                transform: rotate(225deg);
              }
            }
          }
        }
      }
      .overview-vote-wrap {
        display: flex;
        justify-content: space-between;
        margin-bottom: px2rem(50px);
        .vote-cols-wrap {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: px2rem(130px);
          padding: px2rem(20px);
          border-radius: px2rem(8px);
          background: linear-gradient(90deg, rgba(96, 74, 196, 0.3) 0%, rgba(69, 67, 186, 0.3) 100%);
          &:before {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            content: '';
            background-repeat: no-repeat;
            background-size: contain;
            background-position: right center;
          }
          &:nth-child(2) {
            margin: 0 px2rem(30px);
          }
          &.image-text:nth-child(1):before {
            background-image: url('https://xzh5.hoge.cn/new-vote/images/cols_img_bg@3x.png');
          }
          &.video-text:nth-child(1):before {
            background-image: url('https://xzh5.hoge.cn/new-vote/images/woks_icon@2x.png');
          }
          &.audio-text:nth-child(1):before {
            background-image: url('https://xzh5.hoge.cn/new-vote/images/cols_audio_bg@3x.png');
          }
          &.text-text:nth-child(1):before {
            background-image: url('https://xzh5.hoge.cn/new-vote/images/cols_text_bg@3x.png');
          }
          &:nth-child(2):before {
            background-image: url('https://xzh5.hoge.cn/new-vote/images/vote_icon@2x.png');
          }
          &:nth-child(3):before {
            background-image: url('https://xzh5.hoge.cn/new-vote/images/visited_icon@2x.png');
          }
          &.signup-icon:before {
            @include img-retina('~@/assets/vote/signup-icon@2x.png', '~@/assets/vote/signup-icon@3x.png', px2rem(86px), px2rem(120px));
          }
          &.examine-icon:before {
            @include img-retina('~@/assets/vote/examine-icon@2x.png', '~@/assets/vote/examine-icon@3x.png', px2rem(93px), px2rem(120px));
          }
          .vote-count {
            @include font-dpr(18px);
            color: #fff;
            line-height: 1;
            margin-bottom: px2rem(20px);
          }
          .vote-desc {
            @include font-dpr(11px);
            color: #fff;
            line-height: 1;
          }
        }
      }
      .overview-menus-wrap {
        display: flex;
        // padding: 0 0 0.67rem;
        margin-bottom: px2rem(40px);
        .menu-wrap {
          flex: 1;
          height: px2rem(80px);
          line-height: px2rem(80px);
          text-align: center;
          border-radius: px2rem(8px);
          font-size: 0;
          background-color: #FC7465;
          &.menu-right {
            margin-right: px2rem(30px);
          }
          .rank, .mine {
            font-size: px2rem(28px);
            color: #fff;
            margin-right: 0.3rem;
          }
          .mine {
              position: relative;
              top:1px;
          }
          .menu-text {
            display: inline-block;
            @include font-dpr(14px);
            color: #fff;
          }
        }
      }
      .overview-list-title-wrap {
        display: flex;
        width: 100%;
        height: px2rem(30px);
        line-height: px2rem(30px);
        font-size: px2rem(24px);
        color: #4943B7;
        margin-bottom: px2rem(40px);
        .line {
          flex: 1;
          height: px2rem(15px);
          border-bottom: 1px dashed #4A43B7;
          &:first-child {
            margin-right: px2rem(20px);
          }
          &:last-child {
            margin-left: px2rem(20px);
          }
        }
      }
      .overview-search-bar-wrap {
        display: flex;
        width: 100%;
        height: px2rem(80px);
        border-radius: px2rem(8px);
        box-sizing: border-box;
        background-color: rgba(0, 0, 0, 0.25);
        .search-input {
          flex: 1;
          padding: px2rem(20px);
          font-size: px2rem(28px);
          color: #fff;
          border: none;
          outline: none;
          background: none !important;
          &::placeholder {
            color: rgba(255, 255, 255, 0.25);
          }
        }
        .search-icon {
          margin-right: px2rem(20px);
          width: px2rem(34px);
          height: 100%;
          background-repeat: no-repeat;
          background-position: center;
          background-size: px2rem(34px);
          background-image: url('https://xzh5.hoge.cn/new-vote/images/search_icon_normal@2x.png');
          background-image: image-set(url('https://xzh5.hoge.cn/new-vote/images/search_icon_normal@2x.png') 1x, url('https://xzh5.hoge.cn/new-vote/images/search_icon_normal@3x.png') 2x);
          &.focus {
            background-image: url('https://xzh5.hoge.cn/new-vote/images/search_icon_hover@2x.png');
            background-image: image-set(url('https://xzh5.hoge.cn/new-vote/images/search_icon_hover@2x.png') 1x, url('https://xzh5.hoge.cn/new-vote/images/search_icon_hover@3x.png') 2x);
          }
        }
      }
    }
    .rule-dialog-wrap {
      padding: px2rem(60px) px2rem(40px) px2rem(100px) px2rem(40px);
      .rule-header {
        margin-bottom: px2rem(45px);
        text-align: center;
        @include font-dpr(17px);
        color: #333333;
      }
      .rule-content {
        @include font-dpr(15px);
        line-height: px2rem(48px);
        color: #666;
      }
    }
  }
</style>
