<template>
  <view class="show-ah-container">
    <image :src="iconAhBgImgUrl" mode="aspectFill" class="img"></image>
    <text class="ah">{{ ah }}</text>
  </view>
</template>

<script setup lang="ts">
import iconAhBgImgUrl from '@/assets/images/components/icon_ah-bg.png'
interface Props {
  ah: string
}
const props = withDefaults(defineProps<Props>(), {
  ah: '案件名称未知'
})
</script>

<style lang="scss" scoped>
.show-ah-container {
  position: relative;
  height: 140rpx;
  .img {
    width: 100%;
    height: 140rpx;
  }
  .ah {
    position: absolute;
    left: 0;
    top: 50%;
    padding: 20rpx 40rpx;
    font-weight: bold;
    /* background: linear-gradient(90deg, rgba(0, 240, 255, 0.73), #018eff); */
    font-size: 36rpx;
    color: #fff;
    transform: translateY(-50%);
  }
}
</style>
