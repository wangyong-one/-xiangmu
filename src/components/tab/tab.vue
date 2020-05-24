<template>
  <div class="tab">
    <cube-tab-bar
      :useTransition=false
      :showSlider=true
      v-model="selectedLabel"
      :data="tabs"
      ref="tabBar"
      class="border-bottom-1px"
    >
    </cube-tab-bar>
    <div class="slide-wrapper">
    <cube-slide
      :loop=false
      :auto-play=false
      :show-dots=false
      :initial-index="index"
      ref="slide"
      :options="slideOptions"
      @scroll="onScroll"
      @change="onChange"
    >
      <cube-slide-item v-for="(tab, index) in tabs" :key="index">
        <component :is="tab.component" :data="tab.data" ref="component"></component>
      </cube-slide-item>
    </cube-slide>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'tab',
    props: {
      tabs: {
        type: Array,
        default() {
          return []
        }
      },
      // 默认可以选择一个下标 不写死为默认下标0
      initialIndex: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        index: this.initialIndex,
        slideOptions: {
            listenScroll: true,
            probeType: 3,
            // 一 定要设置他的域值设为0 防止他有要横向滚动和竖向滚动出现斜线滚动
            directionLockThreshold: 0
        }
      }
    },
    computed: {
      selectedLabel: {
        get() {
          return this.tabs[this.index].label
        },
        set(newVal) {
          this.index = this.tabs.findIndex((value) => {
            return value.label === newVal
          })
        }
      }
    },
    mounted() {
      this.onChange(this.index)
    },
    methods: {
      onScroll(pos) {
        const tabBarWidth = this.$refs.tabBar.$el.clientWidth
        const slideWidth = this.$refs.slide.slide.scrollerWidth
        const transform = -pos.x / slideWidth * tabBarWidth
        this.$refs.tabBar.setSliderTransform(transform)
      },
      onChange(current) {
        this.index = current
        const instance = this.$refs.component[current]
        instance.fetch && instance.fetch()
        }
      }
    }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .tab
    display: flex
    flex-direction: column
    height: 100%
    >>> .cube-tab
      padding: 10px 0
    .slide-wrapper
      flex: 1
      overflow: hidden
</style>
