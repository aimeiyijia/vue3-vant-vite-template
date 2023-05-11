<template>
  <view class="files-list-show-contaner">
    <view v-for="(item, index) in operaFilesList" :key="item.fileName" class="view-file">
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
        <!-- <u-button
          type="primary"
          :plain="true"
          shape="circle"
          size="mini"
          icon="download"
          @click="handleDownFile(item)"
        ></u-button> -->
        <view v-if="showDownloadButton" class="file-download">
          <i
            class="file__opera-icon download-icon icon-ep-download"
            @click="handleDownFile(item)"
          ></i>
        </view>
        <view v-if="showDeleteButton" class="file-del">
          <i class="file__opera-icon delete-icon icon-ep-delete" @click="handleDelFile(index)"></i>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import iconXlsImg from '@/assets/images/icons/excel.png'
import iconImgImg from '@/assets/images/icons/img.png'
import iconPdfImg from '@/assets/images/icons/pdf.png'
import iconTxtImg from '@/assets/images/icons/txt.png'
import iconUnkownImg from '@/assets/images/icons/unkown.png'
import iconDocImg from '@/assets/images/icons/word.png'
import iconZipImg from '@/assets/images/icons/zip.png'
import { getFileType } from '@/utils'

interface Props {
  filesList: any[]
  fileNameStyle: object
  showDownloadButton: boolean
  showDeleteButton: boolean
  ahdm: string
  openByMini: boolean
  directView: boolean
}
const props = withDefaults(defineProps<Props>(), {
  filesList: () => [],
  fileNameStyle: () => ({}),
  showDownloadButton: true,
  showDeleteButton: false,
  ahdm: '',
  openByMini: false,
  directView: false
})

const emits = defineEmits(['del'])

const supportFileType = 'doc、docx、xls、xlsx、pdf'
const supportImgType = 'jpg、jpeg、png'
const operaFilesList = ref<any[]>([])

const fileType = computed(() => {
  return {
    txt: iconTxtImg,
    doc: iconDocImg,
    docx: iconDocImg,
    xls: iconXlsImg,
    xlsx: iconXlsImg,
    jpg: iconImgImg,
    jpeg: iconImgImg,
    png: iconImgImg,
    pdf: iconPdfImg,
    zip: iconZipImg,
    rar: iconZipImg
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

onMounted(() => {
  if (props.directView) {
    handleDownFile(props.filesList[0])
  }
})

function getFileTypeImg(file) {
  return (file.type && fileType.value[file.type.toLowerCase()]) || iconUnkownImg
}
function handleDownFile(file) {
  if (props.openByMini) {
    viewFileByMini(file)
  } else {
    downloadFile(file.filePath)
  }
}
function downloadFile(filepath) {
  console.log(filepath)
  wx.showLoading({
    title: '下载中...'
  })
  const fileurl = import.meta.env.VITE_downloadUrl + '/' + filepath
  uni.downloadFile({
    url: fileurl,
    success: res => {
      const tempFilePath = res.tempFilePath
      const fileType = tempFilePath.substring(
        tempFilePath.lastIndexOf('.') + 1,
        tempFilePath.length
      )
      console.log(res, '下载')
      if (supportFileType.indexOf(fileType) > -1) {
        uni.openDocument({
          filePath: tempFilePath,
          showMenu: true,
          success: res => {
            uni.hideLoading()

            console.log('打开文档成功')
          },
          fail: err => {
            uni.hideLoading()
            console.log(err, '打开失败')
            uni.showModal({
              title: '温馨提示',
              content: '打开文档失败！' + err.errMsg,
              showCancel: false,
              success: e => {}
            })
          }
        })
      } else if (supportImgType.indexOf(fileType) > -1) {
        uni.previewImage({
          urls: [tempFilePath],
          showmenu: true,
          success: res => {
            uni.hideLoading()

            console.log('打开文档成功')
          },
          fail: err => {
            uni.hideLoading()

            uni.showModal({
              title: '温馨提示',
              content: '打开文档失败！' + err.errMsg,
              showCancel: false,
              success: e => {}
            })
          }
        })
      } else {
        uni.hideLoading()

        uni.showModal({
          title: '温馨提示',
          content: '该文件不支持预览！',
          showCancel: false,
          success: e => {}
        })
      }
    },
    fail: err => {
      uni.hideLoading()

      uni.showModal({
        title: '温馨提示',
        content: '下载失败！' + err.errMsg,
        showCancel: false,
        success: e => {}
      })
    }
  })
}
// 通过小程序预览
function viewFileByMini(file) {
  const { filePath } = file
  wx.openEmbeddedMiniProgram({
    appId: 'wxd441fef27b0532a5',
    path: `pages/download/download?filePath=${filePath}&ahdm=${props.ahdm}`,
    fail: err => {
      console.log(err, '文件预览失败')
      wx.showToast({
        title: '文件预览失败，请稍后重试！'
      })
    }
  })
}
function handleDelFile(delIndex) {
  wx.showModal({
    title: '提示',
    content: '确定删除该文件？',
    success(res) {
      if (res.confirm) {
        const delFiles = operaFilesList.value.splice(delIndex, 1)
        // 剩下的文件，删除的文件
        emits('del', operaFilesList, delFiles)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.view-file,
.files-list-show__info {
  display: flex;
  align-items: center;
}
.view-file {
  justify-content: space-between;
  margin: 12rpx 0;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  background-color: #f5f8fd;
  .files-list-show__info {
    flex-wrap: nowrap;
    justify-content: left;
    flex: 2;
    .text {
      margin: 0 16rpx;
      text-align: left;
      font-size: 28rpx;
      color: #3b7afb;
      word-break: break-all;
    }
  }
  .files-list-show__opera {
    display: flex;
    .file-download,
    .file-del {
      margin: 0 8rpx;
      padding: 4rpx;
      /* border: 3rpx solid #000; */
      /* border-radius: 100%; */
    }
    .file__opera-icon {
      font-weight: bold;
    }
    .download-icon {
      font-size: 42rpx;
      color: #3b7afb;
    }
    .delete-icon {
      font-size: 36rpx;
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
