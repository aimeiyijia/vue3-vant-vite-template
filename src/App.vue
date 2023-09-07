<template>
  <router-view></router-view>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #e4f0ff 0%, #f7f8fc 100%);
  .van-nav-bar {
    background: transparent;
    :deep(.van-icon) {
      font-weight: bold;
      color: #000;
    }
  }
}
.app-container-no-navbar {
  .page-container {
    height: 100%;
  }
}
</style>
