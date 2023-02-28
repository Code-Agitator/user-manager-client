import type {RouteModule, RouteType, RoutesType} from '~/types/router'

/**
 * 基础路由
 */
export const basicRoutes: RoutesType = [
    {
        name: '404',
        path: '/404',
        component: () => import('@/views/hello/hello.vue'),
    }, {
        name: 'hello',
        path: '/hello',
        component: () => import('@/views/hello/hello.vue'),
    }
]
/**
 * 404默认页面
 */
export const NOT_FOUND_ROUTE: RouteType = {
    name: 'NotFound',
    path: '/:pathMatch(.*)*',
    redirect: '/404',
}
/**
 * 空路由
 */
export const EMPTY_ROUTE: RouteType = {
    name: 'Empty',
    path: '/:pathMatch(.*)*',
    component: () => {
    },
}
/**
 * 加载页面路由
 */
const modules = import.meta.glob('@/views/**/route.ts', {eager: true}) as RouteModule
const asyncRoutes: RoutesType = []
Object.keys(modules).forEach((key) => {
    asyncRoutes.push(modules[key].default)
})

export {asyncRoutes}
