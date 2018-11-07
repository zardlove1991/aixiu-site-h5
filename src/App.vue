<template>
  <div id="app">
    <!--测试试卷跳转-->
    <div class="btn-wrap" v-if='!currentExamList.length'>
      <mt-button type="primary" @click.stop="jumpExam(1)">已考列表</mt-button>
      <mt-button type="primary"  @click.stop="jumpExam(2)">未考列表</mt-button>
      <mt-button type="primary" @click.stop='jumpOnlineExam()'>在线测评</mt-button>
    </div>
    <!--主体路由内容渲染-->
    <router-view/>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState('examlist', ['currentExamList'])
  },
  methods: {
    jumpOnlineExam () {
      this.$router.push({
        path: '/examlist',
        query: { listType: 2 }
      })
    },
    jumpExam (state) {
      this.$router.push({
        path: '/examlist',
        query: {
          status: state,
          listType: 1
        }
      })
    }
  }
}
</script>

<style lang="scss">
#app{
  .btn-wrap{
    display: flex;
    justify-content: space-around;
  }
}
</style>
