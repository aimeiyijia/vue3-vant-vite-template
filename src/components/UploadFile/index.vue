<template>
  <view class="upload-file-container">
    <van-uploader accept="image" multiple capture="album" @afterRead="handleAfterRead">
      <van-button type="info" size="mini" round>选择文件</van-button>
    </van-uploader>
    <files-list-show
      :files-list="fileOperaStatus.operaFilesList"
      :file-name-style="fileNameStyle"
      :show-delete-button="true"
      @del="handleDelFile"
    ></files-list-show>
  </view>
</template>

<script setup lang="ts">
import to from 'await-to-js'
import base64 from 'base-64'

import { getFileType, guid } from '@/utils'

import FilesListShow from '../FilesListShow/index.vue'

interface Props {
  filesList: any[]
  fileNameStyle: object
  needDossier: boolean
  ahdm: string
  jdbh: string
}

const props = withDefaults(defineProps<Props>(), {
  filesList: () => [],
  fileNameStyle: () => ({}),
  needDossier: false,
  ahdm: '',
  jdbh: ''
})

const emits = defineEmits(['success', 'fail', 'complete', 'del'])

const needUploadFilesNum = ref(0)
const fileOperaStatus = reactive({
  failFiles: [],
  successFiles: [],
  operaFilesList: []
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
    fileOperaStatus.operaFilesList = fileOperaStatus.operaFilesList.concat(valAndType)
  },
  {
    immediate: true,
    deep: true
  }
)

function handleChangeFiles(files) {
  console.log(files, '选择的文件')
}
async function handleAfterRead(event) {
  const { file: filesArr } = event.detail
  console.log(filesArr, '上传文件')
  needUploadFilesNum.value = filesArr.length
  uni.showLoading({ title: '上传中' })
  for (const singleFile of filesArr) {
    console.log(singleFile, '上传的文件')
    const [err, res] = await to(uploadFilePromise(singleFile))
    if (err) {
      fileOperaStatus.failFiles.push(err)
    }
    if (res) {
      fileOperaStatus.successFiles = fileOperaStatus.successFiles.concat(res)
      fileOperaStatus.operaFilesList = fileOperaStatus.operaFilesList.concat(res)
    }
  }

  const completeFilesLeg = fileOperaStatus.failFiles.length + fileOperaStatus.successFiles.length
  console.log(needUploadFilesNum.value, '需要被上传的文件')
  console.log(completeFilesLeg, '已完成的数量')
  if (completeFilesLeg === needUploadFilesNum.value) {
    uni.hideLoading()
    console.log(fileOperaStatus.failFiles, '上传失败的文件')
    if (fileOperaStatus.failFiles.length > 0) {
      uni.showToast({ title: fileOperaStatus.failFiles[0].error })
    }
    console.log(fileOperaStatus.successFiles, '成功上传的文件')
    emits('success', fileOperaStatus.successFiles)
    emits('fail', fileOperaStatus.failFiles)
    // 上传成功，上传失败仅针对一次上传而言
    fileOperaStatus.successFiles = []
    fileOperaStatus.failFiles = []
    emitOperaComplete()
  }
}
function uploadFilePromise(singleFile) {
  const { url, name } = singleFile
  const fileNameAndType = {
    fileName: name,
    ...getFileType({ fileName: name })
  }
  const params = {
    appID: 'admin',
    uploadID: '',
    ftpDirPath: '/temp/' + guid()
  }
  const base64Str = base64.encode(JSON.stringify(params))
  const formData = {
    data: base64Str
  }
  if (props.needDossier) {
    Object.assign(formData, {
      ahdm: props.ahdm,
      jdbh: props.jdbh
    })
  }
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: import.meta.env.VITE_uploadUrl,
      filePath: url,
      name: 'files',
      header: {
        Authorization: '3cddb9bc53bb42b987cdbae68dfae653'
      },
      formData,
      success: res => {
        if (res.data) {
          const fileData = JSON.parse(res.data)
          if (fileData.code && fileData.code === '0') {
            const files = fileData.files.map(o => {
              const file = {
                fileName: o.filename,
                filePath: o.ftpPath,
                ...getFileType({ fileName: o.filename })
              }
              return file
            })
            resolve(files)
          } else {
            reject({
              error: fileData.msg,
              ...fileNameAndType
            })
          }
        } else {
          reject({
            error: '接口请求异常',
            ...fileNameAndType
          })
        }
      },
      fail: error => {
        reject({
          error,
          ...fileNameAndType
        })
      }
    })
  })
}
function handleDelFile(files, delFiles) {
  fileOperaStatus.operaFilesList = files
  // 剩下的文件，删除的文件
  emits('del', fileOperaStatus.operaFilesList, delFiles)
  emitOperaComplete()
}
function emitOperaComplete() {
  emits('complete', fileOperaStatus.operaFilesList)
}
</script>

<style lang="scss" scoped>
.upload-file-container {
  display: flex;
  flex-direction: column;
}
</style>
