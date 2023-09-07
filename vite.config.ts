import { VantResolver } from '@vant/auto-import-resolver'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImportTypes from 'auto-import-types'
import autoprefixer from 'autoprefixer'
import { resolve } from 'path'
import PiniaAutoRefs from 'pinia-auto-refs'
import pxtovw from 'postcss-px-to-viewport'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// import DefineOptions from 'unplugin-vue-define-options/vite'
import { ConfigEnv, defineConfig, loadEnv } from 'vite'
import commonjs from 'vite-plugin-commonjs'

const { path, existsSync } = require('fs')
const vantDir = path.join('./node_modules', 'vant') // 获取 vant 目录
const designWidth = existsSync(vantDir) ? 375 : 750

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv) => {
  return {
    css: {
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8']
          }),
          pxtovw({
            unitToConvert: 'px', // 要转化的单位
            viewportWidth: designWidth, //100vw=750px，UI设计稿的宽度,vant是375。可参考这个：https://juejin.cn/post/6961737808339795975
            unitPrecision: 6, // 转换后的精度，即小数点位数
            propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
            fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
            selectorBlackList: ['ignore-'], // 指定不转换为视窗单位的类名，
            minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
            mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
            replace: true, // 是否转换后直接更换属性值
            landscape: false // 是否处理横屏情况
            // exclude: [/node_modules\/vant/i]
          })
        ]
      },
      preprocessorOptions: {
        scss: {
          // 全局添加scss变量用
          // additionalData: '@import "@/styles/base.scss";'
        }
      },
      modules: {}
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    define: {},
    plugins: [
      vue(),
      vueJsx({}),
      commonjs(),
      AutoImportTypes({
        dtsDir: 'types'
      }),
      PiniaAutoRefs(),
      AutoImport({
        dts: 'types/auto-imports.d.ts', // 可以自定义文件生成的位置，默认是根目录下
        imports: [
          'vue',
          'pinia',
          {
            '@/helper/pinia-auto-refs': ['useStore']
          }
        ],
        // resolvers: [VantResolver()],
        eslintrc: {
          enabled: true, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: 'readonly' // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        }
      }),
      Components({
        resolvers: [VantResolver()],
        // 指定组件位置，默认是src/components
        dirs: ['src/components'],
        // ui库解析器
        // resolvers: [VantResolver()],
        extensions: ['vue'],
        // 配置文件生成位置
        dts: 'types/components.d.ts'
      }),
      Unocss()
      // DefineOptions()
    ],
    server: {
      port: 3001,
      open: true, //自动打开
      base: './ ', //生产环境路径
      proxy: {
        // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
        // 正则表达式写法
        '^/api': {
          target: 'http:192.168.0.0:0000', // 后端服务实际地址
          changeOrigin: true, //开启代理
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
