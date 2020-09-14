import Vue from 'vue'
import Router from 'vue-router'
import STORAGE from '@/utils/storage'
// 引入动态组件
const getComponent = name => () => import(`@/components/${name}`)
const getVoteComponent = name => () => import(`@/components/vote/main/${name}`)
const routeBase = () => {
  let href = window.location.href
  if (href.indexOf('pre') > 0) {
    return '/pre/'
  }
  return '/'
}

Vue.use(Router)

let router = new Router({
  mode: 'history',
  // base: '/pre/',
  base: routeBase(),
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
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
        delta: route.query.delta, // 小程序需要回退的页面层级
        listType: route.query.listType // 列表渲染类型 list: 正常列表  errorlist: 错题列表
      }),
      meta: {
        title: '加载中...'
      }
    },
    {
      path: '/alllist/:id',
      name: 'depencelist',
      component: getComponent('depence-all'),
      props: (route) => ({
        id: route.params.id, // 传入需要请求当前试卷的ID
        rtp: route.query.rtp, // 试卷渲染的类型 考试:exam 解析:analysis
        restart: route.query.restart, // 是否需要重新开始考试 需要:need 不需要:none
        redirect: route.query.redirect, // 小程序传入的重定向地址
        delta: route.query.delta, // 小程序需要回退的页面层级
        listType: route.query.listType // 列表渲染类型 list: 正常列表  errorlist: 错题列表
      }),
      meta: {
        title: '加载中...'
      }
    },
    {
      path: '/statistic/:id',
      name: 'statistic',
      component: getComponent('form-statistic'),
      props: (route) => ({
        id: route.params.id, // 传入需要请求当前试卷的ID
        redirect: route.query.redirect, // 小程序传入的重定向地址
        delta: route.query.delta // 小程序需要回退的页面层级
      }),
      meta: {
        title: '测评结果'
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
        id: route.params.id, // 传入需要请求当前试卷的ID
        redirect: route.query.redirect, // 小程序传入的重定向地址
        delta: route.query.delta // 小程序需要回退的页面层级
      }),
      meta: {
        title: '测评'
      }
    },
    {
      path: '/permission',
      name: 'permission',
      component: getComponent('permission'),
      props: (route) => ({
        errorMsg: route.query.errorMsg,
        redirect: route.query.redirect
      }),
      meta: {
        title: '温馨提示'
      }
    },
    {
      path: '/votebegin/:id',
      name: 'votebegin',
      component: getVoteComponent('vote-start'),
      props: (route) => ({
        id: route.params.id
      }),
      meta: {
        title: '首页'
      }
    },
    {
      path: '/votedetail/:flag/:id',
      name: 'votedetail',
      component: getVoteComponent('vote-detail'),
      props: (route) => ({
        id: route.params.id,
        flag: route.params.flag
      }),
      meta: {
        title: '详情'
      }
    },
    {
      path: '/voterank/:flag/:id',
      name: 'voterank',
      component: getVoteComponent('vote-rank'),
      props: (route) => ({
        id: route.params.id,
        flag: route.params.flag
      }),
      meta: {
        title: '排行榜'
      }
    },
    {
      path: '/votemy/:flag/:id',
      name: 'votemy',
      component: getVoteComponent('vote-my'),
      props: (route) => ({
        id: route.params.id,
        flag: route.params.flag
      }),
      meta: {
        title: '我的'
      }
    },
    {
      path: '/votesubmit/:flag/:id',
      name: 'votesubmit',
      component: getVoteComponent('vote-submit'),
      props: (route) => ({
        id: route.params.id,
        flag: route.params.flag
      }),
      meta: {
        title: '上传作品'
      }
    },
    {
      path: '/voteoneself/:flag/:id',
      name: 'voteoneself',
      component: getVoteComponent('vote-oneself'),
      props: (route) => ({
        id: route.params.id,
        flag: route.params.flag
      }),
      meta: {
        title: '我的作品'
      }
    }
  ]
})

// 添加路由后置钩子
router.afterEach((to, from) => {
  let storeAuthReload = STORAGE.get('auth-reload-info')
  // 如果有重载的认证信息需要重置状态
  if (storeAuthReload && storeAuthReload[to.path]) {
    storeAuthReload[to.path] = false
    STORAGE.set('auth-reload-info', storeAuthReload)
  }
})

export default router
