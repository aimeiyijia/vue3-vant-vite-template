<template>
  <view class="vant-form-container br20">
    <p-form ref="formRef">
      <template v-for="item in options" :key="item.field" v-bind="item" class="vant-form__item">
        <p-vant-field
          v-if="item.vantType === 'Field'"
          v-model="formData.data[item.field]"
          :rules="formData.rules[item.field]"
          :border="false"
          clearable
          v-bind="item"
        >
          <template #button>
            <slot v-if="item.slots && item.slots.button" :name="item.slots.button"></slot>
          </template>
        </p-vant-field>
        <vant-field-picker
          v-if="item.vantType === 'Picker'"
          v-model="formData.data[item.field]"
          :rules="formData.rules[item.field]"
          v-bind="item"
        ></vant-field-picker>
        <vant-field-calendar
          v-if="item.vantType === 'Calendar'"
          v-model="formData.data[item.field]"
          :rules="formData.rules[item.field]"
          v-bind="item"
        ></vant-field-calendar>
      </template>
    </p-form>
  </view>
</template>

<script setup lang="ts">
import PForm from '@/components/PVant/PForm/index.vue'
import PVantField from '@/components/PVant/PVantField/index.vue'

import PVantFieldCalendar from './components/VantFieldCalendar/index.vue'
import VantFieldPicker from './components/VantFieldPicker/index.vue'
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  options: {
    type: Object,
    default: () => ({})
  },
  rules: {
    type: Object,
    default: () => ({})
  }
})
const emits = defineEmits(['update:modelValue'])
const formRef = ref()
const formData = reactive({
  data: props.modelValue,
  rules: props.rules
})
// 留作以后扩展
const formOperaMethods = reactive({})

watch(
  () => formData.data,
  value => {
    emits('update:modelValue', value)
  },
  {
    deep: true
  }
)

onMounted(() => {
  Object.assign(formOperaMethods, formRef.value)
})

defineExpose({
  formOperaMethods
})
</script>

<style lang="scss">
.vant-form-container {
  .icon__required {
    position: absolute;
    left: -10rpx;
    top: -4rpx;
    font-size: 22rpx;
    color: var(--red, #ee0a24);
  }
  .form__vant-field {
    flex: 1;
  }
  .cell__value--container {
    display: flex;
    position: relative;
    flex-direction: column;
    flex: 1;
    /* align-items: center; */
    .error__message {
      margin-top: -18rpx;
      /* position: absolute;
      left: 0;
      bottom: 0rpx; */
      line-height: 110%;
      text-align: left;
      font-size: 20rpx;
      color: var(--red, #ee0a24);
    }
  }
}
</style>
