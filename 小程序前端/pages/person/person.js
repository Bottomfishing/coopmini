const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
    data: {
        userInfo: {
            userInfo: {},
            avatarUrl: defaultAvatarUrl,
            nickName: '',
        },
        pic_: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
        user_: "点击登录/注册",
        personalized: "个人状态：未完善",
        isLoggedIn: false
    },

    // 初始化页面
    onLoad() {
        this.initUserInfo();
    },

    // 页面显示时重新加载用户信息
    onShow() {
        this.initUserInfo(); // 原有初始化逻辑
        // 新增：从本地存储同步最新数据
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
            this.setData(userInfo); 
        }
    },

    // 初始化用户信息
    initUserInfo() {
        const userInfo = getApp().globalData.userInfo || wx.getStorageSync('userInfo');
        this.setData({
            userInfo: userInfo || {},
            isLoggedIn: !!userInfo
        });
    },
    toPersonDatil(e) {
        wx.navigateTo({
            url: '/pages/mine/persondetail/persondetail',
        })
    },

    // 跳转到log页面
    // 跳转到log页面
    navigateToLog() {
        wx.navigateTo({
            url: '/pages/log/log',
            success: () => console.log('跳转log页面成功'),
            fail: (err) => {
                console.error('跳转log页面失败', err);
                wx.showToast({ title: '跳转失败，请稍后再试', icon: 'none' });
            }
        });
    },

    // 页面显示时执行
    onShow() {
        this.initUserInfo();
    },
    //监听下拉刷新
    onPullDownRefresh() {
        console.log("用户进行了下拉刷新")

        //模拟网络请求：定时器
        setTimeout(() => {
            this.setData({ listCount: 30 })

            //API:停止下拉刷新
            wx.stopPullDownRefresh({
                success: (res) => {
                    console.log("成功停止了");
                },
                fail: (err) => {
                    console.log("失败停止了下拉刷新");
                }
            })
        }, 1000)
    },

    // 显示退出登录确认对话框
    showLogoutConfirm() {
        wx.showModal({
            title: '确认退出',
            content: '确定要退出登录吗？',
            success: (res) => {
                if (res.confirm) {
                    this.logout();
                }
            }
        });
    },

    // 退出登录逻辑
    logout() {
        try {
            // 清除全局数据中的用户信息
            getApp().globalData.userInfo = null;

            // 清除本地存储中的用户信息
            wx.removeStorageSync('userInfo');

            // 更新页面状态为未登录
            this.setData({
                isLoggedIn: false,
                userInfo: {}
            });

            // 显示退出成功提示
            wx.showToast({
                title: '退出登录成功',
                icon: 'success',
                duration: 2000
            });
        } catch (error) {
            console.error('退出登录失败:', error);
            wx.showToast({
                title: '退出登录失败',
                icon: 'error'
            });
        }
    },

    // 页面跳转公共方法
    navigateToPage(url) {
        if (!url) return;
        wx.navigateTo({
            url: url,
            fail: (err) => {
                console.error('页面跳转失败:', err);
                wx.showToast({
                    title: '页面跳转失败',
                    icon: 'error'
                });
            }
        });
    },

    // 跳转到订单页面
    toOrder() {
        this.navigateToPage('/pages/order/order');
    },

    // 跳转到简历页面
    toResume() {
        this.navigateToPage('/pages/resume/resume');
    },

    // 跳转到面试页面
    toInterview() {
        this.navigateToPage('/pages/interview/interview');
    },

    // 跳转到收藏页面
    toHeart() {
        this.navigateToPage('/pages/heart/heart');
    },


    toOrder() {
        wx.navigateTo({
            url: '/pages/order/order',
        })
    },

    toResume() {
        wx.navigateTo({
            url: '/pages/resume/resume',
        })
    },

    toInterview() {
        wx.navigateTo({
            url: '/pages/interview/interview',
        })
    },

    toHeart() {
        wx.navigateTo({
            url: '/pages/heart/heart',
        })
    },
})