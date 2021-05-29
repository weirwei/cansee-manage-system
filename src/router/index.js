import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    }, {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: '系统首页'
                },
                component: () => import (
                /* webpackChunkName: "dashboard" */
                "../views/Dashboard.vue")
            }, {
                path: "/organization",
                name: "organization",
                meta: {
                    title: '组织管理',
                    // permission: true
                },
                component: () => import (
                /* webpackChunkName: "organization" */
                "../views/Organization.vue")
            }, {
                path: "/:orgId/member",
                name: "member",
                meta: {
                    title: '成员管理',
                },
                component: () => import (
                    /* webpackChunkName: "member" */
                    "../views/MemberManage.vue")
            }, {
                path: "/:orgId/proj",
                name: "project",
                meta: {
                    title: '项目管理',
                },
                component: () => import (
                    /* webpackChunkName: "project" */
                    "../views/Project.vue")
            }, {
                path: "/:orgId/:projId/log/:type",
                name: "log",
                meta: {
                    title: '日志管理',
                },
                component: () => import (
                    /* webpackChunkName: "log" */
                    "../views/Log.vue")
            }, {
                path: "/:orgId/:projId/log/all/:reqId",
                name: "requestLog",
                meta: {
                    title: '请求链路',
                },
                component: () => import (
                    /* webpackChunkName: "requestLog" */
                    "../views/RequestLog.vue")
            }, {
                path: '/404',
                name: '404',
                meta: {
                    title: '找不到页面'
                },
                component: () => import (/* webpackChunkName: "404" */
                '../views/404.vue')
            }
        ]
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import (
        /* webpackChunkName: "login" */
        "../views/Login.vue")
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === '13136204665'
            ? next()
            : next('/403');
    } else {
        next();
    }
});

export default router;
