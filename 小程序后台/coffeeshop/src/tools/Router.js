// 路由配置
import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/login/Login.vue'
import Home from '../components/home/Home.vue'
import Store from '../tools/Storage'
import Goods from '../components/order/goods.vue'
import Categories from '../components/order/categories.vue'
import Lunbotu from '../components/set/lunbotu.vue'
import Guangbo from '../components/set/guangbo.vue'

const Router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/login',
            component: Login,
            name: 'login'
        },
        {
            path: '/home',
            component: Home,
            name: 'home',
            children: [
                {
                    path: 'order/goods',
                    component: Goods,
                    name: 'orderGoods',
                    meta: { title: '商品' }
                },
                {
                    path: 'order/categories',
                    component: Categories,
                    name: 'orderCategories',
                    meta: { title: '分类' }
                },
                {
                    path: 'set/lunbotu',
                    component: Lunbotu,
                    name: 'setLunbotu',
                    meta: { title: '轮播图' }
                },
                {
                    path:'set/guangbo',
                    component: Guangbo,
                    name:'setGuangbo',
                    meta: { title: '广告' }
                }
            ],
            redirect: '/home/order/goods'
        }
    ]
})
Router.beforeEach((from) => {
    let isLogin = Store.getters.isLogin;
    if (isLogin || from.name === 'login') {
        return true;
    } else {
        return { name: 'login' }
    }
})
export default Router;