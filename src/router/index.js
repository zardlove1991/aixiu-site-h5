import Vue from 'vue'
import Router from 'vue-router'
// 引入动态组件
const getComponent = name => () => import(`@/components/${name}`)

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/examlist',
      component: getComponent('examlist'),
      props: (route) => ({
        status: Number(route.query.status), // 只有在考试的时候 1:代表已考 2:代表未考
        listType: Number(route.query.listType) // 当前列表类型 1:代表考试 2:代表测评
      }),
      meta: {
        title: '试题列表'
      }
    },
    {
      path: '/examPrepare',
      name: 'examPrepare',
      component: getComponent('examPrepareInfo'),
      props: (route) => ({
        examFlag: route.query.examFlag // 针对特殊开始考试的标志 partyjoin:入党考试 其它的时候不用传
      })
    },
    {
      path: '/examgrade',
      name: 'examgrade',
      component: getComponent('examgrade'),
      meta: {
        title: '答题卡'
      }
    },
    {
      path: '/onlineExamgrade',
      name: 'onlineExamgrade',
      component: getComponent('onlineExamgrade'),
      meta: {
        title: '答题卡'
      },
      props: (route) => ({
        status: route.query.asheetStatus
      })
    },
    {
      path: '/onlineExamList/:id',
      name: 'onlineExamList',
      component: getComponent('onlineExamList'),
      props: (route) => ({
        id: route.params.id, // 传入需要请求当前试卷的ID
        title: route.query.title, // 当前考试的试卷的标题
        showType: route.query.showType, // 当前渲染的类型 测评:testing 考试:examnation 错题集:errorlist
        optionType: route.query.optionType, // 当前跳转的行为标识 正常渲染:normal (默认) 重新答题:reanswer
        subjectId: route.query.subjectId, // 当前是否有直接跳转的题目序号ID (试卷数据中有个answer_max_question_id 为了继续答题使用)
        subjectIndex: route.query.subjectIndex // 当前是否有直接跳转的题目序号信息
      })
    },
    {
      path: '/errorlist',
      name: 'errorlist',
      component: getComponent('errorList'),
      meta: {
        title: '我的错题'
      }
    },
    {
      path: '/depencelist',
      name: 'depencelist',
      component: getComponent('depence-list'),
      props: (route) => ({
        id: route.params.id // 传入需要请求当前试卷的ID
      })
    }
  ]
})
