<template>
  <div class="richText-container">
    <editor
      v-model="content"
      :disabled="isShow"
      :tinymce-script-src="tinymceSrc"
      :init="init"
      @input="contentChange"
    />
  </div>
</template>

<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue'

import { editInit, showInit } from './init'

interface Props {
  modelValue: any
  isShow: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  isShow: false
})

const emits = defineEmits(['update:modelValue'])

const content = ref('')
const init = props.isShow ? showInit : editInit
const tinymceSrc = `${window.location.href.split('#')[0]}static/tinymce/tinymce.min.js`
watch(
  () => props.modelValue,
  () => {
    content.value = props.modelValue
    console.log(content.value, 'content.value')
  },
  {
    deep: true,
    immediate: true
  }
)
function contentChange(val) {
  console.log('变化')
  emits('update:modelValue', val)
}
</script>
<style>
.richText-container {
  height: 100%;
}
.tox-notification {
  display: none !important;
}
.tox-statusbar {
  display: none !important;
}
</style>
