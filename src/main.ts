import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {setupRouter} from "@/router";
import 'virtual:windi.css'

/**
 * 初始化程序
 */
const setupApp = async () => {
    const app = createApp(App)
    // 加载路由
    await setupRouter(app)
    app.mount('#app')
}

setupApp().then(ignore => {
})


