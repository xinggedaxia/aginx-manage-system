import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '网站监控', icon: 'dashboard' }
    }]
  },
  {
    path: '/account-manage',
    component: Layout,
    children: [
      {
        path: '',
        name: 'AccountManage',
        component: () => import('@/views/account-manage'),
        meta: { title: '账号管理', icon: 'user' }
      }
    ]
  },
  {
    path: '/user-manage',
    component: Layout,
    children: [
      {
        path: '',
        name: 'UserManage',
        component: () => import('@/views/user-manage/index'),
        meta: { title: '用户管理', icon: 'peoples' }
      }
    ]
  },
  {
    path: '/question-manage',
    component: Layout,
    meta: { title: '题目管理', icon: 'form' },
    children: [
      {
        path: 'maintenance',
        name: 'QuestionMaintenance',
        component: () => import('@/views/question-manage/question-maintenance'),
        meta: { title: '题目维护' }
      },
      {
        path: 'type',
        name: 'QuestionType',
        component: () => import('@/views/question-manage/question-type'),
        meta: { title: '题目类型' }
      },
      {
        path: 'feedback',
        name: 'QuestionFeedback',
        component: () => import('@/views/question-manage/question-feedback'),
        meta: { title: '题目反馈' }
      },
      {
        path: 'add',
        name: 'AddQuestion',
        hidden: true, // 不在侧边栏显示
        component: () => import('@/views/question-manage/question-maintenance/component/add-question')
      },
      {
        path: 'edit/:createFormData',
        name: 'EditQuestion',
        hidden: true, // 不在侧边栏显示
        component: () => import('@/views/question-manage/question-maintenance/component/edit-question')
      }
    ]
  },
  {
    path: '/system-log',
    component: Layout,
    children: [
      {
        path: '',
        name: 'SystemLog',
        component: () => import('@/views/system-log'),
        meta: { title: '系统日志', icon: 'el-icon-document' }
      }
    ]
  },
  {
    path: '/website-feedback',
    component: Layout,
    children: [
      {
        path: '',
        name: 'WebsiteFeedback',
        component: () => import('@/views/website-feedback'),
        meta: { title: '网站反馈', icon: 'el-icon-document' }
      }
    ]
  },
  {
    path: '/flag-manage',
    component: Layout,
    children: [
      {
        path: '',
        name: 'FlagManage',
        component: () => import('@/views/flag-manage'),
        meta: { title: '标识管理', icon: 'el-icon-document' }
      }
    ]
  },
  {
    path: '/create-form',
    component: Layout,
    children: [
      {
        path: '',
        name: 'CreateForm',
        component: () => import('@/views/create-form/'),
        meta: { title: '生成表单', icon: 'el-icon-document' }
      }
    ]
  },
  {
    hidden: true, // 不在侧边栏显示
    path: '/personal-info',
    component: Layout,
    children: [
      {
        path: '',
        name: 'PersonalInfo',
        component: () => import('@/views/personal-info'),
        meta: { title: '个人资料', icon: 'el-icon-document' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://aginx.cn/',
        meta: { title: '访问官网', icon: 'link' }
      }
    ]
  },
  {
    path: 'external-link-api',
    component: Layout,
    children: [
      {
        path: 'https://yapi.baidu.com/project/25354/interface/api',
        meta: { title: '接口文档', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
var base = process.env.NODE_ENV === 'production' ? '/manage/' : '/'
const createRouter = () => new Router({
  mode: 'hash', // require service support
  base: base,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
