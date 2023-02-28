import type {Router} from 'vue-router'

const baseTitle: string = import.meta.env.VITE_APP_TITLE

/**
 * 添加页面title 路由守卫
 * @param router
 */
export function createPageTitleGuard(router: Router) {
    router.afterEach((to) => {
        const pageTitle = to.meta?.title
        if (pageTitle)
            document.title = `${pageTitle} | ${baseTitle}`
        else
            document.title = baseTitle
    })
}
