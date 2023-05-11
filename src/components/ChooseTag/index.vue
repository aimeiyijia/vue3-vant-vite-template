<template>
  <view class="choose-tag-container">
    <u-grid :border="false" col="3">
      <u-grid-item v-for="item in tags" :key="item.label">
        <u-tag
          class="single-tag"
          :text="item.label"
          :plain="!item.selected"
          :name="item.label"
          @click="radioClick"
        ></u-tag>
      </u-grid-item>
    </u-grid>
  </view>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'radio'
    },
    tags: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {
    resetSelected() {
      this.tags.forEach(o => {
        o.selected = false
      })
      // this.$emit('change', {})
    },
    radioClick(value) {
      const operaTags = this.tags.find(o => o.label === value)
      if (operaTags.selected) {
        operaTags.selected = false
      } else {
        this.tags.forEach(o => {
          o.selected = o.label === value ? true : false
        })
      }

      const selected = this.tags.filter(o => o.selected)
      this.$emit('change', selected[0], this.tags)
    }
  }
}
</script>

<style lang="scss" scoped>
.choose-tag-container {
  display: flex;
  justify-content: flex-start;
  padding: 2px 6px;
  .u-grid {
    width: 100%;
  }
  .single-tag {
    padding: 6px 0;
  }
}
</style>
