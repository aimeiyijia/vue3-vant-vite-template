<template>
  <view class="img-tip-container">
    <van-image
      width="200rpx"
      height="200rpx"
      fit="contain"
      src="https://img.yzcdn.cn/vant/cat.jpeg"
    />
    <text class="model__tip">{{ tip }}</text>
  </view>
</template>

<script setup lang="ts">
interface Props {
  src: string
  tip: string
}
withDefaults(defineProps<Props>(), {
  src: '',
  tip: ''
})
</script>

<style lang="scss" scoped>
.model__tip {
  display: inline-block;
  margin-top: 16rpx;
  margin-bottom: 32rpx;
}
</style>
