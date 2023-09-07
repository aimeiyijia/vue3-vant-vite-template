<template>
  <view class="files-list-show-contaner">
    <view v-for="item in operaFilesList" :key="item.fileName" class="view-file">
      <view class="files-list-show__info">
        <van-image
          :src="getFileTypeImg(item)"
          width="24px"
          height="24px"
          shape="square"
        ></van-image>
        <text class="text" :style="fileNameStyle" @click="handleDownFile(item)">
          {{ item.fileName }}
        </text>
      </view>
      <view class="files-list-show__opera">
        <!-- <view v-if="showDownloadButton" class="file-download">
          <i
            class="file__opera-icon download-icon icon-ep-download"
            @click="handleDownFile(item)"
          ></i>
        </view>
        <view v-if="showDeleteButton" class="file-del">
          <i class="file__opera-icon delete-icon icon-ep-delete" @click="handleDelFile(index)"></i>
        </view> -->
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
function getImageUrl(name: string) {
  return new URL(`/src/assets/images/icons/${name}`, import.meta.url).href
}
const iconUnkownImg = getImageUrl('unkown.png')
import { getFileType } from '@/utils'

interface Props {
  filesList: any[]
  fileNameStyle?: object
  showDownloadButton?: boolean
  showDeleteButton?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  filesList: () => [],
  fileNameStyle: () => ({}),
  showDownloadButton: true,
  showDeleteButton: false
})

const emits = defineEmits(['del'])

const supportFileType = 'doc、docx、xls、xlsx、pdf'
const supportImgType = 'jpg、jpeg、png'
const operaFilesList = ref<any[]>([])

const fileType = computed(() => {
  return {
    txt: getImageUrl('txt.png'),
    doc: getImageUrl('word.png'),
    docx: getImageUrl('word.png'),
    xls: getImageUrl('excel.png'),
    xlsx: getImageUrl('excel.png'),
    jpg: getImageUrl('img.png'),
    jpeg: getImageUrl('img.png'),
    png: getImageUrl('img.png'),
    pdf: getImageUrl('pdf.png'),
    zip: getImageUrl('zip.png'),
    rar: getImageUrl('zip.png')
  }
})

watch(
  () => props.filesList,
  val => {
    const valAndType = val.map(o => {
      return {
        ...o,
        ...getFileType({ fileName: o.fileName })
      }
    })
    operaFilesList.value = valAndType
  },
  {
    deep: true,
    immediate: true
  }
)

onMounted(() => {})

function getFileTypeImg(file) {
  return (file.type && fileType.value[file.type.toLowerCase()]) || iconUnkownImg
}
function handleDownFile(file) {
  const fileName = file.fileName.substring(0, file.fileName.lastIndexOf('.'))
  window.open(import.meta.env.VITE_downloadUrl + file.filePath + '?filename=' + encodeURI(fileName))
}
function handleDelFile(delIndex) {}
</script>

<style lang="scss" scoped>
.view-file,
.files-list-show__info {
  display: flex;
  align-items: center;
}
.view-file {
  justify-content: space-between;
  margin: 6px 0;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #f5f8fd;
  .files-list-show__info {
    flex-wrap: nowrap;
    justify-content: left;
    flex: 2;
    .text {
      margin: 0 8px;
      text-align: left;
      font-size: 14px;
      color: #222;
      word-break: break-all;
    }
  }
  .files-list-show__opera {
    display: flex;
    .file-download,
    .file-del {
      margin: 0 4px;
      padding: 2px;
      /* border: 3px solid #000; */
      /* border-radius: 100%; */
    }
    .file__opera-icon {
      font-weight: bold;
    }
    .download-icon {
      font-size: 20px;
      color: #3b7afb;
    }
    .delete-icon {
      font-size: 18px;
      color: #ee0a24;
    }
    .file-download {
      margin-left: 0;
    }
    .file-del {
      margin-right: 0;
    }
  }
}
</style>
