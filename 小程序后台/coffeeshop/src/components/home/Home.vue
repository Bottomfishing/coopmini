<template>
    <el-container id="container" style="height: 100vh;">
        <el-aside :width="asideWidth" style="overflow: hidden;">

            <el-container id="top"
                style="background-color: #001529; display: flex; align-items: center; height: 60px; padding-left: 20px;">
                <img style="width:25px; height:25px;" src="~@/assets/logo.png">
                <div class="logo-title" v-show="!isCollapse"
                    :style="{ opacity: isCollapse ? 0 : 1, transform: isCollapse ? 'translateX(-10px)' : 'translateX(0)' }">
                    后台管理系统</div>
            </el-container>

            <el-menu :collapse="isCollapse" router :default-active="$route.path" style="height:100%; width: 100%"
                background-color="#001529" text-color="rgba(255,255,255,0.8)" active-text-color="#fff"
                @select="selectItem">

                <el-sub-menu index="1">
                    <template #title>
                        <el-icon>
                            <Goods />
                        </el-icon>
                        <span>订单管理</span>
                    </template>
                    <el-menu-item index="/home/order/goods">商品</el-menu-item>
                    <el-menu-item index="/home/order/categories">分类</el-menu-item>
                </el-sub-menu>

                <el-sub-menu index="2">
                    <template #title>
                        <el-icon>
                            <Document />
                        </el-icon>
                        <span>列表管理</span>
                    </template>
                    <el-menu-item index="/home/set/Lunbotu">轮播图</el-menu-item>
                    <el-menu-item index="/home/set/Guangbo">广播</el-menu-item>
                </el-sub-menu>

            </el-menu>
        </el-aside>
        <el-main style="margin: 0;padding: 0;">

            <!-- 添加一个通用的头部 -->
            <el-header>
                <el-icon :size="30" @click="handleCollapse" style="transition: transform 1s ease; margin-left: 16px;">
                    <Fold :style="{ transform: isCollapse ? 'rotate(180deg)' : 'rotate(0deg)' }" />
                </el-icon>

                <el-breadcrumb style="margin-left: 10px; font-size: 18px;">
                    <el-breadcrumb-item :to="{ path: '/' }">
                        <span>首页</span>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item v-if="$route.path !== '/'">
                        <span>{{ $route.meta.title }}</span>
                    </el-breadcrumb-item>

                </el-breadcrumb>
                <div style="flex: 1; width: 0; display: flex; align-self:center; justify-content: flex-end">
                    <el-dropdown>
                        <div
                            style="display: flex; align-items: center; margin-right: 10px; font-size: 16px; cursor: default;">
                            <img src="@/assets/logo.png" alt="默认头像" style="width: 36px; height: 36px;">
                            <span>管理员</span>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>{{ $store.state.userName }}</el-dropdown-item>
                                <el-dropdown-item @click="logout">注销</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <span class="element-icons el-icon-quanping" style="font-size: 26px; margin: 0 5px; display: flex; align-items: center
                    ; margin-right: 20px; color: #363636;" @click="handleFull"></span>
                </div>

            </el-header>
            <!-- 这里用来渲染具体功能模块 -->
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
import Storage from '../../tools/Storage'
export default {
    name: 'HomePage',
    data() {
        return {
            isCollapse: false, // 控制菜单是否折叠
            asideWidth: '250px', // 菜单宽度
        }
    },
    methods: {
        logout() {
            Storage.commit('clearUserInfo')
            this.$router.replace('/login')
        },
        selectItem(index) {
            this.$router.push(index)
        },
        handleCollapse() { // 控制菜单折叠
            this.isCollapse = !this.isCollapse
            this.asideWidth = this.isCollapse ? '64px' : '250px'
        },
        handleFull() { // 全屏
            if (document.fullscreenElement) { // 退出全屏
                document.exitFullscreen()
            } else { // 进入全屏
                document.documentElement.requestFullscreen()
            }
        }
    }
}
</script>
<style scoped>
#top {
    transition: all 0.3s ease-in-out;
    overflow: hidden;
}

.logo-title {
    margin-left: 12px;
    color: #ffffff;
    font-size: 17px;
    transition: all 0.3s ease, transform 0.3s ease;
}

.el-menu {
    width: 100% !important;
    border-right: none !important;
}

.el-menu--inline .el-menu-item {
    background-color: #000c17 !important;
    padding-left: 40px !important;
}

.el-menu-item:hover {
    color: #fff !important;
}

.el-sub-menu__title:hover,
.el-sub-menu__title:hover span,
.el-sub-menu__title:hover i {
    color: #fff !important;
    transition: all 0.3s ease-in-out;
}

.el-menu-item.is-active {
    background-color: #0072dd !important;
    border-radius: 5px;
    margin: 0 4px !important;
}

.el-sub-menu.is-active {
    background-color: #00315e !important;
}

.el-menu-item {
    margin: 0 4px !important;

}

.el-sub-menu__title {
    margin: 0 4px !important;
}

.el-aside {
    transition: width 0.3s ease-in-out;
    box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
}

.el-header {
    margin: 0;
    padding: 0;
    height: 60px;
    box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
    display: flex;
    align-items: center;
}
</style>