<template>
  <div class="fullscene-list-wrap" :class="darkMark === '2' ? 'light' : ''">
    <div class="input-wrap" @click.stop="showFullsceneAction()">
      <el-input
        :value="fullSceneMap[checkFullScene][0]"
        :readonly="true"
        :disabled="isLoading"
        @blur="blurAction()"
        placeholder="请选择">
      </el-input>
      <div :class="['vote-type-base', (!isShowFullScene && isLoading) ? 'vote-type-down': 'vote-type-up']"></div>
      <div class="dropdown-wrap" v-show="isShowFullScene && !isLoading">
        <div class="dropdown-item item0">
          <div class="fullscene-item"
            @click.stop="toggleCheck(key)"
            v-for="(key, index) in fullSceneType"
            :class="checkFullScene === key ? 'active' : ''"
            :key="index">{{fullSceneMap[key][0]}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fullSceneMap } from '@/utils/config'

export default {
  props: {
    searchVal: String,
    darkMark: String,
    isLoading: {
      type: Boolean,
      default: false
    },
    fullSceneType: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    searchVal (val) {
      if (val) {
        this.checkFullScene = val
      }
    }
  },
  data () {
    return {
      checkFullScene: '1',
      isShowFullScene: false,
      fullSceneMap
    }
  },
  created () {
    if (this.searchVal) {
      this.checkFullScene = this.searchVal
    }
  },
  methods: {
    blurAction () {
      document.body.scrollTop = 0
    },
    showFullsceneAction () {
      this.isShowFullScene = !this.isShowFullScene
    },
    toggleCheck (key) {
      this.isShowFullScene = false
      if (key !== this.checkFullScene) {
        this.checkFullScene = key
        this.$emit('fullSceneChange', key)
      }
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .fullscene-list-wrap {
    .input-wrap {
      position: relative;
      .el-input__inner {
        height: px2rem(80px);
        line-height: px2rem(80px);
        border-radius: px2rem(16px);
        background-color: rgba(255, 255, 255, 0.1);
        border: 0px;
        // color: #fff;
        @include font-color('fontColor');
        @include font-dpr(14px);
        @include line-overflow(1);
        padding-right: px2rem(60px);
        &::placeholder {
          // color: #fff;
          @include font-color('fontColor');
        }
      }
      .vote-type-base {
        position: absolute;
        z-index: 11;
        right: px2rem(28px);
        top: px2rem(32px);
        width: px2rem(24px);
        height: px2rem(14px);
        background-size: px2rem(24px) px2rem(14px);
        &.vote-type-down {
          @include img-retina("~@/assets/vote/vote-type-down@2x.png","~@/assets/vote/vote-type-down@3x.png", 100%, 100%);
        }
        &.vote-type-up {
          @include img-retina("~@/assets/vote/vote-type-up@2x.png","~@/assets/vote/vote-type-up@3x.png", 100%, 100%);
        }
      }
    }
    .dropdown-wrap {
      z-index: 11;
      position: absolute;
      top: px2rem(90px);
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      border-radius: px2rem(8px);
      .dropdown-item {
        flex: 1;
        @include font-dpr(14px);
        &.item0 {
          @include bg-color('descColor');
          @include font-color('fontColor');
        }
        &.item1 {
          @include bg-color('compColor');
          color: rgba(255, 255, 255, 0.5);
        }
        .fullscene-item {
          padding: 0 15px;
          text-align: left;
          height: px2rem(80px);
          line-height: px2rem(80px);
          &.active {
            @include bg-color('compColor');
          }
          &.active2 {
            @include font-color('fontColor');
          }
        }
      }
    }
    &.light {
      .input-wrap {
        .el-input__inner {
          background-color: #fff;
        }
        .vote-type-base.vote-type-down {
          @include img-retina("~@/assets/vote/vote-type-down-light.png","~@/assets/vote/vote-type-down-light.png", 100%, 100%);
        }
        .vote-type-base.vote-type-up {
          @include img-retina("~@/assets/vote/vote-type-up-light@2x.png","~@/assets/vote/vote-type-up-light@3x.png", 100%, 100%);
        }
      }
      .dropdown-wrap {
        .item0 {
          @include bg-color('compColor');
        }
        .item1 {
          @include font-color('fontColor');
        }
        .dropdown-item .fullscene-item {
          &.active, &.active2 {
            @include font-color('descColor');
          }
        }
      }
    }
  }
</style>
