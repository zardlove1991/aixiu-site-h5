import Vue from 'vue'
import Router from 'vue-router'
// 引入动态组件
const getComponent = name => () => import(`@/components/${name}`)

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/depencelist/:id',
      name: 'depencelist',
      component: getComponent('depence-list'),
      props: (route) => ({
        id: route.params.id, // 传入需要请求当前试卷的ID
        rtp: route.query.rtp, // 试卷渲染的类型 考试:exam 解析:analysis
        restart: route.query.restart, // 是否需要重新开始考试 需要:need 不需要:none
        redirect: route.query.redirect, // 小程序传入的重定向地址
        delta: route.query.delta // 小程序需要回退的页面层级
      }),
      meta: {
        title: '加载中...'
      }
    },
    {
      path: '/depencecard/:id',
      name: 'depencecard',
      component: getComponent('depence-card'),
      props: (route) => ({
        id: route.params.id, // 传入需要请求当前试卷的ID
        redirect: route.query.redirect, // 小程序传入的重定向地址
        delta: route.query.delta // 小程序需要回退的页面层级
      }),
      meta: {
        title: '成绩单'
      }
    },
    {
      path: '/depencestart/:id',
      name: 'depencestart',
      component: getComponent('depence-start'),
      props: (route) => ({
        id: route.params.id // 传入需要请求当前试卷的ID
      }),
      meta: {
        title: '加载中...'
      }
    }
  ]
})
