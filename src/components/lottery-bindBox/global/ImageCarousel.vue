<template>
    <div class='image-carousel' :class="{'image-carousel--vertical':(mode==='vertical')}" @mouseover="suspendAutoSlide=true"
    @mouseout="suspendAutoSlide=false">
        <div class="image-carousel__previous" @click="checkPrevious" v-if="!(showSize>images.length)">
            <img src="" alt="">
        </div>
        <div class="image-carousel__image-list">
            <div class="image-carousel__virtual-list" ref="vlist" @click="handleClick"></div>
        </div>
        <div class="image-carousel__next" @click="checkNext"  v-if="!(showSize>images.length)">
            <img src="" alt="">
        </div>
    </div>
</template>

<script>
export default {
  name: '',
  components: {
  },
  props: {
    images: {
      type: Array,
      required: true
    },
    showSize: {
      type: Number,
      default: 3
    },
    imageClass: {
      type: String,
      default: ''
    },
    imageActiveClass: {
      type: String,
      default: ''
    },
    autoSlide: {
      type: Boolean,
      default: false
    },
    autoSlideInterval: {
      type: Number,
      default: 3000,
      validator: (value) => value > 500
    },
    mode: {
      type: String,
      default: 'horizontal',
      validator: (value) => ['horizontal', 'vertical'].includes(value)
    },
    slideTime: {
      type: Number,
      default: 300,
      validator: (value) => value > 16
    }
  },
  data () {
    return {
      req: undefined,
      // displacement:undefined,
      displacement: undefined,
      step: undefined,
      taskList: [],
      timer: undefined,
      suspendAutoSlide: false,
      previousDirection: undefined,
      nextDirection: undefined
    }
  },
  computed: {

  },
  watch: {
    images: {
      handler () {
        if (this.images.length) {
          this.$nextTick(this.init)
        }
      },
      immediate: true
    },
    req () {
      if (this.req === null && this.taskList.length) {
        const task = this.taskList.pop()
        task.call(this)
      }
    },
    autoSlide: {
      handler (val) {
        if (val) {
          this.timer = setInterval(() => {
            if (this.suspendAutoSlide || this.showSize > this.images.length || document.hidden) {
              return
            }
            this.checkNext()
            setTimeout(() => {
              const src = this.$refs.vlist.firstElementChild.src
              this.$emit('autoslide-image', {src})
            }, this.slideTime)
          }, this.autoSlideInterval)
        } else {
          clearInterval(this.timer)
          this.timer = null
        }
      },
      immediate: true
    }
  },
  created () {
  },
  mounted () {

  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    if (this.req) {
      window.cancelAnimationFrame(this.req)
      this.req = null
    }
  },
  methods: {
    init () {
      this.initDirection()
      this.initImageList()
      this.initStep()
    },
    initDirection () {
      if (this.mode === 'horizontal') {
        this.previousDirection = 'left'
        this.nextDirection = 'right'
      } else {
        this.previousDirection = 'top'
        this.nextDirection = 'bottom'
      }
    },
    initStep () {
      this.step = this.displacement / (this.slideTime / 16)
    },
    initImageList () {
      this.$refs['vlist'].innerHTML = ''
      for (let i = 0; i < this.images.length && i < this.showSize; i++) {
        this.$refs['vlist'].appendChild(this.createImageEl(this.images[i]))
      }
      const imageListEl = this.$el.querySelector('.image-carousel__image-list')
      const imageEl = this.$refs['vlist'].children[0]
      const imageElStyle = window.getComputedStyle(imageEl)
      if (this.mode === 'horizontal') {
        this.displacement = parseInt(imageElStyle.marginLeft) + parseInt(imageElStyle.marginRight) + parseInt(imageEl.offsetWidth)
        imageListEl.style.width = this.displacement * this.$refs['vlist'].childElementCount + 'px'
        imageListEl.style.height = parseInt(imageEl.offsetHeight) + parseInt(imageElStyle.marginTop) + parseInt(imageElStyle.marginBottom) + 'px'
      } else {
        this.displacement = parseInt(imageElStyle.marginTop) + parseInt(imageElStyle.marginBottom) + parseInt(imageEl.offsetHeight)
        imageListEl.style.height = this.displacement * this.$refs['vlist'].childElementCount + 'px'
        imageListEl.style.width = parseInt(imageEl.offsetWidth) + parseInt(imageElStyle.marginLeft) + parseInt(imageElStyle.marginRight) + 'px'
      }
    },
    createImageEl (url) {
      let img = document.createElement('img')
      img.src = url
      img.classList.add('image-carousel__image')
      this.imageClass && img.classList.add(this.imageClass)
      return img
    },
    handleClick (event) {
      if (event.target.className.includes('image-carousel__image')) {
        const src = event.target.currentSrc
        this.$emit('click-image', {src})
        if (this.imageActiveClass) {
          let children = Array.from(this.$refs['vlist'].children)
          children.forEach(el => {
            el.classList.remove(this.imageActiveClass)
          })
          event.target.classList.add(this.imageActiveClass)
        }
      }
    },
    checkPrevious () {
      if (this.req) {
        this.taskList.push(this.checkPrevious)
        return
      }
      let index = this.images.findIndex(image => image === this.$refs.vlist.firstElementChild.src)
      index--
      if (index < 0) {
        index = this.images.length - 1
      }
      const previousImageEL = this.createImageEl(this.images[index])
      this.$refs.vlist.insertBefore(previousImageEL, this.$refs.vlist.firstElementChild)
      this.$refs.vlist.style[this.previousDirection] = `-${this.displacement}px`
      this.movingTowardPrevious()
    },
    movingTowardPrevious () {
      let previousDisplacement = parseInt(window.getComputedStyle(this.$refs.vlist)[this.previousDirection]) + this.step
      if (previousDisplacement > 0) {
        this.$refs.vlist.style[this.previousDirection] = '0'
        window.cancelAnimationFrame(this.req)
        this.req = null
        this.$refs.vlist.removeChild(this.$refs.vlist.lastElementChild)
        this.$refs.vlist.style[this.previousDirection] = ''
      } else {
        this.$refs.vlist.style[this.previousDirection] = previousDisplacement + 'px'
        this.req = window.requestAnimationFrame(this.movingTowardPrevious)
      }
    },
    checkNext () {
      if (this.req) {
        this.taskList.push(this.checkNext)
        return
      }
      let index = this.images.findIndex(image => image === this.$refs.vlist.lastElementChild.src)
      index++
      if (index > this.images.length - 1) {
        index = 0
      }
      const nextImageEL = this.createImageEl(this.images[index])
      this.$refs.vlist.appendChild(nextImageEL)
      this.$refs.vlist.style[this.nextDirection] = -`${this.displacement}px`
      this.movingTowardNext()
    },
    movingTowardNext () {
      let nextDisplacement = parseInt(window.getComputedStyle(this.$refs.vlist)[this.nextDirection]) + this.step
      if (nextDisplacement > 0) {
        this.$refs.vlist.style[this.nextDirection] = '0'
        window.cancelAnimationFrame(this.req)
        this.req = null
        this.$refs.vlist.removeChild(this.$refs.vlist.firstElementChild)
        this.$refs.vlist.style[this.nextDirection] = ''
      } else {
        this.$refs.vlist.style[this.nextDirection] = nextDisplacement + 'px'
        this.req = window.requestAnimationFrame(this.movingTowardNext)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.image-carousel {
  display: inline-flex;
  align-items: center;
  &--vertical {
    flex-direction: column;
  }
  &__previous,
  &__next {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 60px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    cursor: pointer;
    .image-carousel--vertical & {
      width: 60px;
      height: 24px;
    }
  }
  &__next > img {
    transform: rotate(180deg);
    .image-carousel--vertical & {
      transform: rotate(270deg);
    }
  }
  &__previous > img {
    transform: rotate(0deg);
    .image-carousel--vertical & {
      transform: rotate(90deg);
    }
  }
  &__image-list {
    position: relative;
    margin: 0 5px;
    overflow: hidden;
    .image-carousel--vertical & {
      margin: 5px 0;
    }
  }
  &__virtual-list {
    position: absolute;
    display: inline-flex;
    .image-carousel--vertical & {
      flex-direction: column;
    }
  }
  &__image {
    width: 140px;
    max-width: none;
    height: 140px;
    margin: 0 5px;
    object-fit: contain;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    cursor: pointer;
    .image-carousel--vertical & {
      margin: 5px 0;
    }
  }
}
</style>
