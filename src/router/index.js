import Vue from 'vue'
import Router from 'vue-router'
import ExamList from '@/components/examlist'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/examlist',
      component: ExamList,
      props: (route) => ({
        status: Number(route.query.status), // 只有在考试的时候 1:代表已考 2:代表未考
        listType: Number(route.query.listType) // 当前列表类型 1:代表考试 2:代表测评
      })
    }
  ]
})
