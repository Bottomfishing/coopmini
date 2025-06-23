// order.js

Page({

    data: {
        categories: [],
        currentGoods: [],
        cartCount: 0,
        currentCategoryIndex: 0,
        cartItems: wx.getStorageSync('cartItems') || [],
        cartVersion: 0,
        isCategoryLoading: true // 新增分类加载状态
    },

    // 页面加载时初始化数据和事件
    // 添加分类数据获取逻辑
    async onLoad() {
        this.db = wx.cloud.database()
        try {
            await this.getCategories()
            this.loadGoods()
        } catch (error) {
            console.error('初始化失败:', error)
        }
        const app = getApp()
        app.setUserStatusChangeCallback(() => {
            this.syncCartData()
            this.loadGoods()
        })
    },

    // 获取商品分类
    async getCategories() {
        this.setData({ isCategoryLoading: true })
        try {
            const res = await this.db.collection('categories').get()
            console.log('[分类数据]', res.data)
            if (res.data.length === 0) {
                wx.showToast({ title: '暂无分类', icon: 'none' })
            }
            // 验证分类数据格式
            const validCategories = res.data.filter(item => item._id && item.name);
            if (validCategories.length !== res.data.length) {
                console.error('存在无效的分类数据:', res.data.filter(item => !item._id || !item.name));
            }
            this.setData({ categories: validCategories })
        } catch (e) {
            console.error('数据库请求失败:', e)
            wx.showToast({ title: '加载失败', icon: 'error' })
        } finally {
            this.setData({ isCategoryLoading: false })
        }
    },

    // 加载商品数据
    // 修改loadGoods方法添加分页
    async loadGoods() {
        if (this.data.isCategoryLoading) {
            return
        }
        const res = await this.db.collection('goods')
            .where({})
            .orderBy('category', 'asc') // 按分类排序
            .limit(20)  // 添加分页限制
            .get()
        this.setData({ currentGoods: res.data })
    },

    // 分类切换查询商品
    async switchCategory(e) {
        if (this.data.isCategoryLoading) {
            wx.showToast({ title: '分类数据加载中，请稍后', icon: 'none' })
            return
        }
        const index = e.currentTarget.dataset.index;
        if (index < 0 || index >= this.data.categories.length) return
        const category = this.data.categories[index];
        if (!category || !category.good) {
            wx.showToast({ title: '分类数据异常', icon: 'none' })
            return
        }

        try {
            // 查询所有商品并按分类排序
            const res = await this.db.collection('goods')
                .where({})
                .orderBy('category', 'asc')
                .get();
            this.setData({
                currentGoods: res.data,
                currentCategoryIndex: index
            });

            // 找到第一个属于该分类的商品索引
            const firstItemIndex = res.data.findIndex(item => item.category === category.good);
            if (firstItemIndex !== -1) {
                // 滚动到对应位置
                wx.pageScrollTo({
                    selector: `#category-${category.good}`,
                    duration: 300
                });
            }
        } catch (error) {
            console.error('分类切换失败:', error);
            if (error.errMsg.includes('category is undefined')) {
                wx.showToast({ title: '分类数据异常', icon: 'none' })
            } else {
                wx.showToast({ title: '加载失败', icon: 'error' });
            }
        } finally {
            wx.hideLoading();
        }
    },

    // 加入购物车
    async addToCart(e) {
        const goodsId = e.currentTarget.dataset.id;
        const app = getApp()
        if (app.globalData.userInfo) {
            // 登录状态处理：同步到云端购物车集合
            // 已登录用户操作云端购物车
            await this.db.collection('cart').add({
                data: {
                    goodsId,
                    count: 1
                }
            })
        } else {
            // 未登录状态处理：暂存到本地缓存
            // 未登录用户操作本地购物车
            this.data.cartItems.push({ goodsId, count: 1 })
        }
        this.setData({ cartCount: this.data.cartCount + 1 })
        wx.showToast({ title: '添加成功' })
    },

    // 保存购物车到本地缓存
    saveCartToStorage() {
        wx.setStorageSync('cartItems', this.data.cartItems)
        this.setData({ cartVersion: this.data.cartVersion + 1 })
    },

    // 页面隐藏时保存购物车数据
    onHide() {
        this.saveCartToStorage()
    },

    // 页面卸载时保存购物车数据
    onUnload() {
        this.saveCartToStorage()
    },

    // 同步购物车数据
    async syncCartData() {
        const app = getApp()
        if (app.globalData.userInfo) {
            // 数据合并策略：1.合并本地和云端数据 2.清空云端旧数据 3.批量写入合并后数据
            // 合并本地和云端购物车
            // 云端购物车查询改为自动获取_openid
            const cloudRes = await this.db.collection('cart').get()

            // 删除旧数据时移除_openid条件
            await this.db.collection('cart').remove()

            // 添加购物车数据时移除_openid字段
            await this.db.collection('cart').add({
                data: {
                    goodsId,
                    count: 1
                }
            })
            const mergedCart = [...this.data.cartItems, ...cloudRes.data]
            await this.db.collection('cart').remove()

            for (const item of mergedCart) {
                // 保留最新时间戳，避免数据覆盖冲突
                await this.db.collection('cart').add({
                    data: {
                        ...item,
                    }
                })
            }
            this.setData({ cartItems: [] })
        }
    },

    // 跳转至购物车页面
    goToCart() {
        wx.navigateTo({ url: '/pages/cart/cart' })
    }

})