<template>
  <view class="detail-card-container">
    <view v-if="data.length <= 0" class="no-reply">
      <image :src="iconNoReply" class="img"></image>
      <text class="text">暂无回复信息</text>
    </view>

    <view v-for="item in data" v-else :key="item.time" class="detail-card">
      <view class="detail-card__header">
        <text class="title">{{ item.title }}</text>
        <text class="info">{{ item.info }}</text>
      </view>
      <van-divider></van-divider>
      <view class="detail-card__content">
        <text class="content">{{ item.content }}</text>
        <files-list-show class="files-list" :files-list="item.filesList"></files-list-show>
      </view>
      <view class="detail-card__footer">
        <view class="time">
          <image class="img" :src="iconTime" />
          {{ item.time }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import iconNoReply from '@/assets/images/icons/icon_no-reply.png'
import iconTime from '@/assets/images/icons/icon_time.png'

import FilesListShow from '../FilesListShow/index.vue'
interface Props {
  data: any[]
}
const props = withDefaults(defineProps<Props>(), {
  data: () => []
})
</script>

<style lang="scss" scoped>
.detail-card {
  margin-bottom: 20rpx;
  padding: 24rpx;
  border-radius: 20rpx;
  background-color: #fff;
  &:nth-last-child(1) {
    margin-bottom: 0;
  }
  .detail-card__header {
    .title {
      font-weight: bold;
    }
    .info {
      margin-left: 12rpx;
      vertical-align: text-top;
      font-size: 22rpx;
      color: #3b7afb;
    }
  }
  .detail-card__content {
    padding: 16rpx 0;
    .files-list {
      margin: 12px 0;
    }
  }
  .detail-card__footer {
    .time,
    .img {
      vertical-align: middle;
    }
    .time {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      color: #9d9d9d;
    }
    .img {
      margin-right: 8rpx;
      width: 28rpx;
      height: 28rpx;
    }
  }
}
.no-reply {
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: 24rpx 0;
  border-radius: 20rpx;
  background-color: #fff;
  .img {
    margin-bottom: 16rpx;
    width: 160rpx;
    height: 160rpx;
  }
  .text {
    font-size: 28rpx;
  }
}
</style>
