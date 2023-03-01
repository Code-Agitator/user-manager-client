# Vue 3 + TypeScript + Vite + NaiveUI
### 后端仓库
https://github.com/Code-Agitator/user-manager-server
### 结构说明
* public 公共资源
* src
  * assets 静态资源
  * components 组件
  * layout 主要布局
  * router 路由配置
    * guard 路由守卫配置
    * routes 动态路由配置
  * service 接口业务部分
    * user 用户模块
      * type 封装请求和响应的type
      * api 对外暴露的api接口
  * util 工具封装
    * http http 封装 封装了axios 暴露两个http  一个是自动封装响应结构体的http 一个是不封装的httpNative
  * views 页面
    * user 用户模块
      * manager 用户管理
      * route.ts 用户生成动态路由
* types 声明一些全局通用type
