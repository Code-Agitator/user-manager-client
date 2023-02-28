import type { Router } from 'vue-router'
import {createPageTitleGuard} from "@/router/guard/page-title-guard";

export function setupRouterGuard(router: Router) {
  createPageTitleGuard(router)
}
