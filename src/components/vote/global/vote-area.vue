<template>
  <tips-dialog
    :show="show"
    @close="close()">
    <div class="limit-dialog-wrap flex-column-dialog" slot="tips-content">
      <div class="limit-header">活动地区限制</div>
      <div class="limit-content">仅支持
        <span v-for="(area, index) in limitArea" :key="index" class="tips"> {{area}}<span v-show="index < limitArea.length - 1" class="split-line"> / </span></span> 地区用户参与活动
      </div>
      <div v-if='curApp !== ""' class='auth-info-wrap'>
        若您的设备正在所属地区，请先确认系统设置中,是否已经开启允许{{curApp}}访问位置信息
      </div>
      <button class="dialog-ok-btn" @click="close()">好的</button>
    </div>
  </tips-dialog>
</template>

<script>
import TipsDialog from '@/components/vote/global/tips-dialog'
import { mapMutations } from 'vuex'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    limitArea: {
      type: Array,
      default: () => {
        return []
      }
    },
    curApp: {
      type: String,
      default: ''
    }
  },
  components: {
    TipsDialog
  },
  watch: {
    show (newState) {
      // 更改当前是否显示遮罩的状态
      this.setModelThumbState(newState)
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    ...mapMutations('depence', {
      setModelThumbState: 'SET_MODEL_THUMB_STATE'
    })
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .auth-info-wrap{
    margin-bottom: px2rem(40px);
    font-size: px2rem(24px);
    line-height: px2rem(30px);
    text-align: center;
    color: #FF6A45;
  }
  .limit-dialog-wrap {
    padding: px2rem(86px) px2rem(60px) px2rem(91px) px2rem(60px);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .limit-header {
      margin-bottom: px2rem(15px);
      text-align: center;
      @include font-dpr(16px);
      color: #333333;
    }
    .tips {
      color: #151515;
      font-weight: 500;
    }
    .limit-content {
      text-align: center;
      margin-bottom: px2rem(40px);
      @include font-dpr(14px);
      line-height: px2rem(44px);
      color: #333333;
      .split-line {
        color: #999;
      }
    }
    .dialog-ok-btn {
      width: px2rem(270px);
      height: px2rem(70px);
      line-height: px2rem(70px);
      text-align: center;
      border: 1px solid #CCCCCC;
      background: #fff;
      border-radius: px2rem(35px);
      @include font-dpr(14px);
      color: #666666;
    }
  }
</style>
