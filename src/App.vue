<template>
  <div id="app">
    <!--主体路由内容渲染-->
    <router-view/>
    <!--图片预览插件-->
    <lg-preview></lg-preview>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>
