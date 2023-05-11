<template>
  <view class="cell-list-container">
    <van-cell-group v-bind="group">
      <van-cell
        v-for="cell in cellData"
        :key="cell.prop"
        use-label-slot
        v-bind="cell"
        @click="handleClick(cell)"
      >
        <!-- 接收默认插槽，也就是value插槽 -->
        <template #default>
          <view class="van-cell__value-custom">
            <slot v-if="$slots.value" name="value" :data="cell"></slot>
            <files-list-show
              v-if="cell.valueType === 'file'"
              :files-list="cell.$cellValue"
              :file-name-style="{ width: '200rpx' }"
            ></files-list-show>
            <text v-else-if="cell.$cellValue">{{ cell.$cellValue }}</text>
          </view>
          <!-- 使用作用域插槽的情况下，外部必须接收 #value="{ data }" -->
        </template>
        <template #title>
          <view class="van-cell__title-custom">
            <slot v-if="$slots.title" name="title" :data="cell"></slot>
            <text v-else>{{ cell.$cellTitle }}</text>
          </view>
        </template>
        <template v-if="$slots.label" #label>
          <slot name="label" :data="cell"></slot>
        </template>

        <!-- 这么写作用域插槽不起作用，普通的插槽可以 -->
        <!-- <template v-for="item in buildinSlots">
          <slot v-if="$slots[item]" :data="cell" :name="item"></slot>
        </template> -->
      </van-cell>
    </van-cell-group>
  </view>
</template>

<script setup lang="ts">
import omit from 'lodash.omit'

import FilesListShow from '../../FilesListShow/index.vue'
const props = defineProps({
  group: {
    type: Object,
    default: () => ({})
  },
  config: {
    type: Object,
    default: () => ({})
  },
  cols: {
    type: Array,
    default: () => []
  },
  data: {
    type: Object,
    default: () => ({})
  }
})
const emits = defineEmits(['click'])
const cellData = computed(() => {
  return (props.cols as any).map(o => {
    const hasValueProp = Object.hasOwn(o, 'value')
    return {
      ...omit(o, ['title', 'value']),
      $cellTitle: o.title,
      $cellValue: hasValueProp ? o.value : props.data[o.prop || '']
    }
  })
})
function handleClick(item) {
  emits('click', item)
}
</script>

<style scoped lang="scss"></style>
