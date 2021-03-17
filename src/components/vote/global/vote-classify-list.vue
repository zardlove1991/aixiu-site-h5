<template>
  <div class="classify-list-wrap" :class="darkMark === '2' ? 'light' : ''">
    <div class="input-wrap" @click.stop="showClassifyAction()">
      <el-input v-model="tempSearchVal"
        :readonly="true"
        @blur="blurAction()"
        placeholder="全部">
      </el-input>
      <div :class="['vote-type-base', !isShowClassify ? 'vote-type-down': 'vote-type-up']"></div>
      <div class="dropdown-wrap" v-show="isShowClassify">
        <div class="dropdown-item item0">
          <div class="classify-item"
            :class="currentId === item.id ? 'active' : ''"
            @click.stop="toggleCheck(item)" v-for="(item, index) in classifyData" :key="index">{{item.name}}</div>
        </div>
        <div class="dropdown-item item1" v-if="tmpObj[currentId] && tmpObj[currentId].length">
          <div>
            <div class="classify-item"
              :class="currentId2 === item.id ? 'active2' : ''"
              @click.stop="toggleCheck2(item)" v-for="(item, index) in tmpObj[currentId]" :key="index">{{item.name}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '@/api/module/examination'

export default {
  props: {
    id: String,
    searchVal: String,
    darkMark: String
  },
  data () {
    return {
      classifyData: [],
      tmpObj: {},
      currentId: '',
      currentId2: '',
      isShowClassify: false,
      tempSearchVal: ''
    }
  },
  created () {
    this.initData()
  },
  watch: {
    searchVal (val) {
      this.tempSearchVal = val
    }
  },
  methods: {
    initData () {
      API.getVoteType({
        query: { id: this.id }
      }).then(res => {
        let data = res.data
        if (data && data.length) {
          this.classifyData = [{ id: '', name: '全部' }, ...data]
          this.currentId = this.classifyData.id
          this.initClassifyData(data)
        }
      })
    },
    blurAction () {
      document.body.scrollTop = 0
    },
    initClassifyData (classifyData) {
      let tmpObj = {}
      for (let i = 0; i < classifyData.length; i++) {
        let item = classifyData[i]
        tmpObj[item.id] = item.child
      }
      this.tmpObj = tmpObj
    },
    toggleCheck (item) {
      this.currentId = item.id
      this.currentId2 = ''
      this.tempSearchVal = item.name
      if (!item.child || item.child.length < 1) {
        this.showClassifyAction()
      }
    },
    toggleCheck2 (item) {
      this.currentId2 = item.id
      this.tempSearchVal = item.name
      this.showClassifyAction()
    },
    showClassifyAction () {
      this.isShowClassify = !this.isShowClassify
      if (!this.isShowClassify && this.tempSearchVal) {
        if (this.tempSearchVal === '全部') {
          this.$emit('success', '')
        } else {
          this.$emit('success', this.tempSearchVal)
        }
      }
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .classify-list-wrap {
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
        .classify-item {
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
        .dropdown-item .classify-item {
          &.active, &.active2 {
            @include font-color('descColor');
          }
        }
      }
    }
  }
</style>
