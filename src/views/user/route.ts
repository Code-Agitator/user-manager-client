import type {RouteType} from '~/types/router'

const Layout = () => import('@/layout/index.vue')

export default {
    name: 'User',
    path: '/user',
    component: Layout,
    redirect: '/user/manager',
    meta: {
        title: '系统用户',
    },
    children: [
        {
            name: 'User',
            path: 'manager',
            component: () => import('@/views/user/manager/index.vue'),
            meta: {
                title: '用户管理',
            },
        },
    ],
} as RouteType
