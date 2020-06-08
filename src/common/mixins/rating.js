// 公共的商品评价展示组件进行抽象出来
// 这是混入组件从一些相同的功能或者代码中抽象出来
const ALL = 2

export default {
  data() {
    return {
      selectType: ALL,
      onlyContent: true
    }
  },
  computed: {
    computedRatings() {
      var ret = []
      this.ratings.forEach((rating) => {
        if (this.onlyContent && !rating.text) {
          return
        }
        if (this.selectType === ALL || rating.rateType === this.selectType) {
          ret.push(rating)
        }
      })
      return ret
    }
  },
  methods: {
    onSelect(type) {
      this.selectType = type
    },
    onToggle() {
      this.onlyContent = !this.onlyContent
    }
  }
}
