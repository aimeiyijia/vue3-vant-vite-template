import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImportTypes from 'auto-import-types'
import { resolve } from 'path'
import PiniaAutoRefs from 'pinia-auto-refs'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// import DefineOptions from 'unplugin-vue-define-options/vite'
import { ConfigEnv, defineConfig, loadEnv } from 'vite'
import commonjs from 'vite-plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv) => {
  return {
    css: {
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
