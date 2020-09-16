<template>
  <div class="classify-list-wrap">
    <div class="input-wrap" @click.stop="showClassifyAction()">
      <el-input v-model="tempSearchVal"
        @input="inputAction()"
        @blur="blurAction()"
        placeholder="全部分类">
      </el-input>
      <div class="drop-icon"></div>
    </div>
    <div class="dropdown-wrap" v-show="isShowClassify">
      <div class="dropdown-item">
        <div class="classify-item"
          :class="currentId === item.id ? 'active' : ''"
          @click.stop="toggleCheck(item)" v-for="(item, index) in classifyData" :key="index">{{item.name}}</div>
      </div>
      <div class="dropdown-item item1">
        <div v-if="tmpObj[currentId] && tmpObj[currentId].length">
          <div class="classify-item"
            :class="currentId2 === item.id ? 'active2' : ''"
            @click.stop="toggleCheck2(item)" v-for="(item, index) in tmpObj[currentId]" :key="index">{{item.name}}</div>
        </div>
        <div v-else>
          <div class="classify-item no-data">暂无数据</div>
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
    searchVal: String
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
          this.classifyData = data
          this.currentId = data[0].id
          this.initClassifyData(data)
        }
      })
    },
    inputAction () {
      setTimeout(() => {
        this.$emit('success', this.tempSearchVal)
      }, 800)
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
    },
    toggleCheck2 (item) {
      this.currentId2 = item.id
      this.tempSearchVal = item.name
    },
    showClassifyAction () {
      this.isShowClassify = !this.isShowClassify
      if (!this.isShowClassify && this.tempSearchVal) {
        this.$emit('success', this.tempSearchVal)
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
        border-radius: px2rem(8px);
        background-color: rgba(255, 255, 255, 0.1);
        border: 0px;
        color: #fff;
        @include font-dpr(14px);
        &::placeholder {
          color: #fff;
        }
      }
      .drop-icon {
        position: absolute;
        right: px2rem(28px);
        top: px2rem(32px);
        width: px2rem(30px);
        height: px2rem(16px);
        background-size: px2rem(30px) px2rem(16px);
        @include img-retina("~@/assets/common/dropdown-icon@2x.png","~@/assets/common/dropdown-icon@3x.png", 100%, 100%);
      }
    }
    .dropdown-wrap {
      z-index: 10;
      position: absolute;
      top: px2rem(90px);
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      border-radius: px2rem(8px);
      @include bg-linear-color('compColor');
      .dropdown-item {
        flex: 1;
        color: #fff;
        @include font-dpr(14px);
        &.item1 {
          // @include bg-color('btnColor');
          color: rgba(255, 255, 255, 0.5);
        }
        .classify-item {
          text-align: center;
          height: px2rem(80px);
          line-height: px2rem(80px);
          // &.active {
          //   @include bg-color('btnColor');
          // }
          &.active2 {
            color: #fff;
          }
          &.no-data {
            color: #999;
          }
        }
      }
    }
  }
</style>
