// 商品的详情页面组件
<template>
  <transition
    name="move"
    @after-leave="afterLeave"
  >
  <!-- 通过v-show="visible"是封装在mixins里面 使用mixins这个属性调用 这个控制详情的显示 -->
    <div class="food" v-show="visible">
      <cube-scroll ref="scroll" :data="computeRatings">
        <div class="food-content">
          <div class="image-header">
            <img :src="food.image">
            <!-- // 返回商品页面按钮 -->
            <div class="back" @click="hide">
              <i class="icon-arrow_lift"></i>
            </div>
          </div>
          <div class="content">
            <h1 class="title">{{food.name}}</h1>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}份</span>
              <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
              <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
            </div>
            <div class="cart-control-wrapper">
              <cart-control @add="addFood" :food="food"></cart-control>
            </div>
            <transition name="fade">
              <div @click="addFirst" class="buy" v-show="!food.count">
                加入购物车
              </div>
            </transition>
          </div>
          <split v-show="food.info"></split>
          <div class="info" v-show="food.info">
            <h1 class="title">商品信息</h1>
            <p class="text">{{food.info}}</p>
          </div>
          <split></split>
          <div class="rating">
            <h1 class="title">商品评价</h1>
            <!-- 这里显示的数据不能换 没有点击事件 -->
            <rating-select
              @select="onSelect"
              @toggle="onToggle"
              :selectType="selectType"
              :onlyContent="onlyContent"
              :desc="desc"
              :ratings="ratings">
            </rating-select>
            <div class="rating-wrapper">
              <ul v-show=" computeRatings &&  computeRatings.length">
                <!-- 在下面在遍历computeRatings 里面的数据 -->
                <li
                  v-for="(rating,index) in computeRatings"
                  class="rating-item border-bottom-1px"
                  :key="index"
                >
                  <div class="user">
                    <!-- 先把moent这个类库引入进来 然后在定义 fromat 方法定义时间戳 -->
                    <span class="name">{{ rating.username}}</span>
                    <img class="avatar" width="12" height="12" :src="rating.avatar">
                  </div>
                  <div class="time">{{format(rating.rateTime)}}</div>
                  <p class="text">
                    <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                  </p>
                </li>
              </ul>
              <div class="no-rating" v-show="! computeRatings || ! computeRatings.length">暂无评价</div>
            </div>
          </div>
        </div>
      </cube-scroll>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import moment from 'moment'
  import CartControl from 'components/cart-control/cart-control'
  import RatingSelect from 'components/rating-select/rating-select'
  import Split from 'components/split/split'
  // import ratingMixin from 'common/mixins/rating'
  // Mixin一种分发 Vue 组件中可复用功能的非常灵活的方式 可以把这一些组件相同的部位抽象出来
  // 用Mixin 进行接收 可以达到重复使用 这个是混入组件的作用
  import popupMixin from 'common/mixins/popup'

  const EVENT_SHOW = 'show'
  const EVENT_ADD = 'add'
  const EVENT_LEAVE = 'leave'

  const All = 2

  export default {
    name: 'food',
    mixins: [popupMixin],
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        // 进行接收rating-select组件的数据 进来就给onlyConten设置 true展示数据
        onlyContent: true,
        selectType: All,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    computed: {
      // 评价数据
      ratings() {
        return this.food.ratings
      },
      // eslint-disable-next-line vue/return-in-computed-property
      computeRatings() {
        const ret = []
        // 循环我们的评级
        this.ratings.forEach((rating) => {
          if (this.onlyContent && !rating.text) {
            return
          }
          // 这里的selectype 控制评级的数据展示
          if (this.selectType === All || this.selectType === rating.rateType) {
            ret.push(rating)
          }
        })
        return ret
      }
    },
    created() {
      // eslint-disable-next-line no-unused-expressions
      this.$on(EVENT_SHOW, () => {
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      })
    },
    mounted() {
      console.log(this.ratings)
    },
    methods: {
      afterLeave() {
        this.$emit(EVENT_LEAVE)
      },
      addFirst(event) {
        this.$set(this.food, 'count', 1)
        this.$emit(EVENT_ADD, event.target)
      },
      addFood(target) {
        this.$emit(EVENT_ADD, target)
      },
      format(time) {
        return moment(time).format('YYYY-MM-DD hh:mm')
      },
      onSelect(type) {
        this.selectType = type
      },
      onToggle() {
        this.onlyContent = !this.onlyContent
      }
     },
    components: {
      CartControl,
      RatingSelect,
      Split
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin.styl"

  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: $color-white
    &.move-enter-active, &.move-leave-active
      transition: all 0.3s linear
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)
    .image-header
    //  height: 0 padding-top: 100%这个布局方式使我们图片变成方形达到以后等比的状态
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: $fontsize-large-xx
          color: $color-white

    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: $fontsize-medium
        font-weight: 700
        color: $color-dark-grey
      .detail
        margin-bottom: 18px
        line-height: 10px
        height: 10px
        .sell-count, .rating
          font-size: $fontsize-small-s
          color: $color-light-grey
        .sell-count
          margin-right: 12px
      .price
        line-height: 24px
        font-weight: 700
        .now
          margin-right: 8px
          font-size: 14px
          color: $color-red
        .old
          text-decoration: line-through
          font-size: $fontsize-small-s
          color: $color-light-grey
      .cart-control-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        font-size: $fontsize-small-s
        color: $color-white
        background: $color-blue
        opacity: 1
        &.fade-enter-active, &.fade-leave-active
          transition: all 0.3s
        &.fade-enter, &.fade-leave-active
          opacity: 0
          z-index: -1
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: $fontsize-medium
        color: $color-dark-grey
      .text
        line-height: 24px
        padding: 0 8px
        font-size: $fontsize-small
        color: $color-grey
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: $fontsize-medium
        color: $color-dark-grey
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          &:last-child
            border-none()
          .user
            position: absolute
            right: 0
            top: 16px
            display: flex
            align-items: center
            line-height: 12px
            .name
              margin-right: 6px
              font-size: $fontsize-small-s
              color: $color-light-grey
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: $fontsize-small-s
            color: $color-light-grey
          .text
            line-height: 16px
            font-size: $fontsize-small
            color: $color-dark-grey
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: $fontsize-small
            .icon-thumb_up
              color: $color-blue
            .icon-thumb_down
              color: $color-light-grey

        .no-rating
          padding: 16px 0
          font-size: $fontsize-small
          color: $color-light-grey
</style>
