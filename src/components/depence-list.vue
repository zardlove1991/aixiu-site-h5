<template lang="html">
  <div class="denpncelist-wrap">
    <!--头部组件-->
    <exam-header :list="subjectList"></exam-header>
    <!-- <subject-header :list="subjectList"></subject-header> -->
    <!--主体试题渲染-->
    <div class="list-wrap">
      <div class="list-item-wrap">
        <h3 class="subject-type">单选题<span class="score">(5分)</span></h3>
        <p class="subject-title">1. 中国古老建筑紫金城午门之前的太庙和社稷坛显示了（）</p>
        <!--每个选择项-->
        <div class="subject-select-wrap" v-for="(item,index) in selects" :key='index'>
          <!--每个选择项描述-->
          <div class="select-tip-wrap" @click.stop="selectOption(index)">
            <div class="select-tip" :class="{active: currentIndex === index}">{{item.key}}</div>
            <div class="select-desc">{{item.desc}}</div>
          </div>
        </div>
        <!--答案解析-->
        <div class="answerinfo-wrap" v-if="false">
          <div class="correct-answer">答案: D</div>
          <div class="answer-analysis">
            <h4 class="title">解析</h4>
            <p class="content">依照《考工记》都城设计礼制--左祖右社,午门之前分设太庙和社稷坛。显示了族权和神权对皇权的供卫</p>
            <div class="exam-types">
              <span class="tip">考点</span>
              <span class="type" v-for="(item,index) in types" :key="index">{{item}}</span>
            </div>
            <p class="percent">正确率: 75%</p>
          </div>
        </div>
      </div>
    </div>
    <!--底部跳转按钮-->
    <div class="btn-wrap">
      <div class="prev">上一题</div>
      <div class="next">下一题</div>
    </div>
  </div>
</template>

<script>
import ExamHeader from './base/exam-header'
import SubjectHeader from './base/subject-header'

export default {
  name: 'depence-list',
  data () {
    return {
      selects: [
        { key: 'A', desc: '族权对皇权和神权的依赖' },
        { key: 'B', desc: '神权对皇权和神权的依赖' },
        { key: 'C', desc: '族权对黄泉和神权的依赖' },
        { key: 'D', desc: '族权对黄泉和神权的依赖' }
      ],
      types: ['艺术鉴赏', '文化历史', '古建筑'],
      currentIndex: -1,
      subjectList: []
    }
  },
  components: {
    ExamHeader,
    SubjectHeader
  },
  created () {
    this._mockData()
  },
  methods: {
    _mockData () {
      let list = []
      for (let i = 0; i < 24; i++) {
        list.push({
          key: `key_${i}`,
          val: i + 1
        })
      }
      this.subjectList = list
    },
    selectOption (index) {
      this.currentIndex = index
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.denpncelist-wrap{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding-bottom: px2rem(90px);
  .list-wrap{
    width: 100%;
    .list-item-wrap{
      width: 100%;
      @include font-dpr(16px);
      @include font-color('titleColor');
      .subject-type{
        display: flex;
        align-items: center;
        padding: px2rem(54px) 0 px2rem(16px) px2rem(32px);
        box-sizing: border-box;
        line-height: 1;
        @include font-dpr(16px);
        .score{
          font-weight: normal;
          margin-left: px2rem(10px);
          @include font-dpr(14px);
        }
      }
      .subject-title{
        @include font-dpr(16px);
        padding:px2rem(39px) px2rem(43px) 0 px2rem(30px);
        box-sizing: border-box;
      }
      .subject-select-wrap{
        padding:px2rem(40px) px2rem(43px) 0 px2rem(30px);
        box-sizing: border-box;
        .select-tip-wrap{
          display: flex;
          align-items: center;
          .select-tip{
            display: flex;
            justify-content: center;
            align-items: center;
            width: px2rem(54px);
            height: px2rem(54px);
            border-radius: 50%;
            margin-right: px2rem(40px);
            @include font-dpr(14px);
            @include bg-color('bgColor');
            @extend .box-shadow;
            &.active{
              @include font-color('bgColor');
              @include bg-color('themeColor');
            }
          }
        }
      }
      .answerinfo-wrap{
        width: 100%;
        padding-top: px2rem(79px);
        .correct-answer{
          display: flex;
          align-items: center;
          width: 100%;
          height: px2rem(100px);
          padding-left: px2rem(30px);
          box-sizing: border-box;
          @include font-dpr(15px);
          @include font-color('titleColor');
          @include border('bottom',1px,solid,'lineColor');
        }
        .answer-analysis{
          width: 100%;
          padding: 0 px2rem(61px) 0 px2rem(30px);
          box-sizing: border-box;
          .title{
            margin: px2rem(26px) 0;
            @include font-dpr(16px);
            @include font-color('titleColor');
          }
          .content{
            line-height: px2rem(44px);
            @include font-dpr(16px);
            @include font-color('titleColor');
          }
          .exam-types{
            display: flex;
            align-items: center;
            margin: px2rem(44px) 0;
            .tip{
              margin-right: px2rem(19px);
              @include font-dpr(13px);
              @include font-color('tipColor');
            }
            .type{
              padding: px2rem(9px) px2rem(12px);
              border-radius: px2rem(4px);
              margin-right: px2rem(19px);
              line-height: 1;
              @include border('all',1px,solid,'themeColor');
              @include font-dpr(12px);
              @include font-color('themeColor');
            }
          }
          .percent{
            line-height: 1;
            padding-bottom: px2rem(61px);
            @include font-dpr(13px);
            @include font-color('tipColor');
          }
        }
      }
    }
  }
  .btn-wrap{
    position: absolute;
    left: 0;
    right: 0;
    bottom: px2rem(10px);
    display: flex;
    justify-content: space-around;
    .prev,.next{
      display: flex;
      justify-content: center;
      align-items: center;
      width: px2rem(330px);
      height: px2rem(80px);
      border-radius: px2rem(40px);
      @include font-dpr(16px);
    }
    .prev{
      @include font-color('themeColor');
      @include border('all',1px,solid,'themeColor');
    }
    .next{
      @include font-color('bgColor');
      @include bg-color('themeColor');
      @include border('all',1px,solid,'themeColor');
    }
  }
}
</style>
