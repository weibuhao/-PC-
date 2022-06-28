import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
// 引入组件库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/css/el-tabs.css'

// rem适配文件
import 'amfe-flexible'

// router.beforeEach((to, from, next) => {
//   // console.log(from);
//   // console.log(from.name, to.name)
//   // if (to.name === 'SearchResult') {
//   //   // from.href
//   //   sessionStorage.setItem('fromName', from.href)
//   // // }else if(to.name==='recommend'){
//   // //   sessionStorage.setItem('')
//   // }
//   next()
// })

createApp(App).use(store).use(router).use(ElementPlus).mount('#app')
