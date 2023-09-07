import 'vant/es/notify/style'

import axios from 'axios'
import { Base64 } from 'js-base64'
import { RawEditorOptions } from 'tinymce'
import { showNotify } from 'vant'
import Vue from 'vue'

type Callback = (filePath?: string) => void

export const editInit: RawEditorOptions = {
  height: 580,
  menubar: false,
  plugins: ['textcolor emoticons spellchecker fullscreen lists link image charmap table picture'],
  language_url: window.location.href.split('#')[0] + '/static/tinymce/langs/zh_CN.js',
  language: 'zh_CN',
  toolbar: [
    'styleselect | fontselect | fontsizeselect | forecolor | backcolor | undo redo | spellchecker | fullscreen',
    'bold italic underline strikethrough subscript superscript | removeformat | bullist numlist |link align alignnone picture charmap table'
  ],
  branding: false,
  resize: true,
  upload: async (files: File[], callback: Callback) => {
    const typeErrorArr: string[] = []
    const sizeErrorArr: string[] = []
    let totalSize = 0
    const fileArr: File[] = []
    const maxSize = 50
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const { name, size } = file
      const fileType = name.substring(name.lastIndexOf('.')).toUpperCase().replace('.', '')
      const checkList = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG']
      if (!checkList.includes(fileType)) {
        typeErrorArr.push(`【${name}】上传失败。不支持格式【${fileType.toLowerCase()}】`)
        continue
      } else if (size > maxSize * 1024 * 1024) {
        sizeErrorArr.push(`【${name}】上传失败。文件大小不得超过【${maxSize}】M`)
        continue
      }
      totalSize += size
      fileArr.push(file)
    }
    if (typeErrorArr.length > 0) {
      callback()
      typeErrorArr.forEach(i => {
        showNotify({ type: 'danger', message: i })
      })
      return
    }
    if (sizeErrorArr.length > 0) {
      callback()
      sizeErrorArr.forEach(i => {
        showNotify({ type: 'danger', message: i })
      })
      return
    }
    if (fileArr.length === 0) {
      callback()
      return
    }
    const formData = new FormData()
    const upData = { ftpDirPath: 'temp' }
    upData.ftpDirPath = `${upData.ftpDirPath}/1234_${new Date().getTime()}`
    formData.append('data', Base64.encode(JSON.stringify(upData)))
    fileArr.forEach(file => {
      formData.append('files', file)
    })
    const { data } = await axios({
      method: 'post',
      url: `${import.meta.env.VITE_BASE_URL}/file/upload`,
      data: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: '3cddb9bc53bb42b987cdbae68dfae653'
      }
    })
    if (data.code === '0') {
      const { files } = data
      files.forEach(file => {
        callback(`${import.meta.env.VITE_downloadUrl}/${file.ftpPath}`)
      })
    } else {
      callback()
      showNotify({ type: 'danger', message: data.msg })
    }
  },
  paste_data_images: true,
  images_upload_handler: async (blobInfo, success, failure, progress) => {
    const file = new File([blobInfo.blob()], blobInfo.filename())
    const formData = new FormData()
    const upData = { ftpDirPath: '/temp' }
    upData.ftpDirPath = `${upData.ftpDirPath}/1234_${new Date().getTime()}`
    formData.append('data', Base64.encode(JSON.stringify(upData)))
    formData.append('files', file)
    const { data } = await axios({
      method: 'post',
      url: `${import.meta.env.VITE_BASE_URL}/file/upload`,
      data: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: '3cddb9bc53bb42b987cdbae68dfae653'
      }
    })
    if (data.code === '0') {
      const { files } = data
      success(`${import.meta.env.VITE_downloadUrl}/${files[0].ftpPath}`)
    }
  }
}

export const showInit = {
  height: 500,
  body_class: 'panel-body',
  content_style: '.panel-body{background-color: #FBFDFF;}',
  menubar: false,
  plugins: [],
  language_url: window.location.href.split('#')[0] + '/static/tinymce/langs/zh_CN.js',
  language: 'zh_CN',
  toolbar: [],
  branding: false,
  resize: false
}
