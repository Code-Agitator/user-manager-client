import type {App} from 'vue'
import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import {EMPTY_ROUTE, NOT_FOUND_ROUTE, basicRoutes as routes, asyncRoutes} from './routes'
import type {RouteType} from '~/types/router'
import {setupRouterGuard} from "@/router/guard";

/**
 * 构造路由
 */
const isHash = import.meta.env.VITE_USE_HASH === 'true'
const VITE_PUBLIC_PATH = import.meta.env.VITE_PUBLIC_PATH
export const router = createRouter({
    history: isHash ? createWebHashHistory(VITE_PUBLIC_PATH ?? '/') : createWebHistory(VITE_PUBLIC_PATH ?? '/'),
    routes,
    scrollBehavior: () => ({left: 0, top: 0}),
})

/**
 * 重置路由
 */
export async function resetRouter() {
    router.getRoutes().forEach((route) => {
        const {name} = route
        router.hasRoute(name!) && router.removeRoute(name!)
    })
    await addDynamicRoutes()
}

/**
 * 添加动态路由
 */
export async function addDynamicRoutes() {
    try {
        asyncRoutes.forEach((route: RouteType) => {
            !router.hasRoute(route.name) && router.addRoute(route)
        })
        router.hasRoute(EMPTY_ROUTE.name) && router.removeRoute(EMPTY_ROUTE.name)
        router.addRoute(NOT_FOUND_ROUTE)
    } catch (error) {
        console.error(error)
    }
}

/**
 * 加载路由
 * @param app
 */
export async function setupRouter(app: App) {
    await addDynamicRoutes()
    setupRouterGuard(router)
    app.use(router)
}
