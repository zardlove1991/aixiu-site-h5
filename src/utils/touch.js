import Vue from 'vue'

function VueTouch (el, binding, type) { // 触屏函数
  let _this = this
  this.obj = el
  this.binding = binding
  this.touchType = type
  this.vueTouches = {x: 0, y: 0} // 触屏坐标
  this.vueMoves = true
  this.vueLeave = true
  this.vueCallBack = typeof (binding.value) === 'object' ? binding.value.fn : binding.value

  this.obj.addEventListener('touchstart', function (e) {
    _this.start(e)
  }, false)

  this.obj.addEventListener('touchend', function (e) {
    _this.end(e)
  }, false)
  this.obj.addEventListener('touchmove', function (e) {
    _this.move(e)
  }, false)
}

VueTouch.prototype = {
  start (e) { // 监听touchstart事件
    this.vueMoves = true
    this.vueLeave = true
    this.longTouch = true
    this.vueTouches = { x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY }
    this.time = setTimeout(function () {
      if (this.vueLeave && this.vueMoves) {
        this.touchType === 'longtap' && this.vueCallBack(this.binding.value, e)
        this.longTouch = false
      }
    }.bind(this), 1000)
  },
  end (e) { // 监听touchend事件
    let disX = e.changedTouches[0].pageX - this.vueTouches.x // 计算移动的位移差
    let disY = e.changedTouches[0].pageY - this.vueTouches.y
    clearTimeout(this.time)
    // 当横向位移大于10，纵向位移大于100，则判定为滑动事件
    if (Math.abs(disX) > 10 || Math.abs(disY) > 100) {
      // 若为滑动事件则返回
      this.touchType === 'swipe' && this.vueCallBack(this.binding.value, e)
      // 判断是横向滑动还是纵向滑动
      if (Math.abs(disX) > Math.abs(disY)) {
        if (disX > 10) {
          // 右滑
          this.touchType === 'swiperight' && this.vueCallBack(this.binding.value, e)
        }
        if (disX < -10) {
          // 左滑
          this.touchType === 'swipeleft' && this.vueCallBack(this.binding.value, e)
        }
      } else {
        if (disY > 10) {
          // 下滑
          this.touchType === 'swipedown' && this.vueCallBack(this.binding.value, e)
        }
        if (disY < -10) {
          // 上滑
          this.touchType === 'swipeup' && this.vueCallBack(this.binding.value, e)
        }
      }
    } else {
      if (this.longTouch && this.vueMoves) {
        this.touchType === 'tap' && this.vueCallBack(this.binding.value, e)
        this.vueLeave = false
      }
    }
  },
  move (e) { // 监听touchmove事件
    this.vueMoves = false
  }
}

/* eslint-disable no-new */
Vue.directive('tap', { // 点击事件
  bind (el, binding) {
    new VueTouch(el, binding, 'tap')
  }
})

Vue.directive('swipe', { // 滑动事件
  bind (el, binding) {
    new VueTouch(el, binding, 'swipe')
  }
})

Vue.directive('swipeleft', { // 左滑事件
  bind (el, binding) {
    new VueTouch(el, binding, 'swipeleft')
  }
})

Vue.directive('swiperight', { // 右滑事件
  bind (el, binding) {
    new VueTouch(el, binding, 'swiperight')
  }
})

Vue.directive('swipedown', { // 下滑事件
  bind (el, binding) {
    new VueTouch(el, binding, 'swipedown')
  }
})

Vue.directive('swipeup', { // 上滑事件
  bind (el, binding) {
    new VueTouch(el, binding, 'swipeup')
  }
})

Vue.directive('longtap', { // 长按事件
  bind (el, binding) {
    new VueTouch(el, binding, 'longtap')
  }
})
