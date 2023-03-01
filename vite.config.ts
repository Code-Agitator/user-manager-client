import {ConfigEnv, defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {NaiveUiResolver} from 'unplugin-vue-components/resolvers'
import WindiCSS from 'vite-plugin-windicss'
import {fileURLToPath, URL} from 'node:url';

// https://vitejs.dev/config/
export default defineConfig((configEnv: ConfigEnv) => {
    const env = loadEnv(configEnv.mode, process.cwd());
    return {
        base: env.VITE_PUBLIC_PATH || '',
        server: {
            proxy: {
                '/service': {
                    target: 'http://localhost:8887/service/',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/service/, '')
                }
            }
        },
        plugins: [
            vue(),
            WindiCSS(),
            AutoImport({
                imports: [
                    'vue',
                    {
                        'naive-ui': [
                            'useDialog',
                            'useMessage',
                            'useNotification',
                            'useLoadingBar'
                        ]
                    }
                ]
            }),
            Components({
                resolvers: [NaiveUiResolver()]
            })
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                '~': fileURLToPath(new URL('./', import.meta.url))
            },
            extensions: [
                '.js',
                '.json',
                '.jsx',
                '.mjs',
                '.ts',
                '.tsx',
                '.vue'
            ]
        }
    }

})
