<template>
  <view class="info-divider-container">
    <van-icon class="info-img" :name="src" size="32rpx" />
    <text class="info-text">{{ text }}：</text>
  </view>
</template>

<script setup lang="ts">
import iconInfo from '@/assets/images/icons/info.png'
interface Props {
  src: string
  text: string
}
const props = withDefaults(defineProps<Props>(), {
  src: iconInfo,
  text: ''
})
</script>

<style scoped lang="scss">
.info-divider-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  padding: 24rpx 0 14rpx;
  width: 300px;
  background-color: transparent;
  .info-img {
    margin-right: 8rpx;
  }
  .info-text {
    color: #222;
  }
}
</style>
