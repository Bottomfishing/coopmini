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
        personalized_: "可查看更多信息",
        isLoggedIn: false
    },

    onLoad() {
        const userInfo = getApp().globalData.userInfo || wx.getStorageSync('userInfo'); // 从全局数据或本地存储读取用户信息
        if (userInfo) {
            this.setData({
                userInfo,
            });
        }
        if (wx.getStorageSync('userInfo')) {
            this.setData({
                isLoggedIn: true,
                userInfo: wx.getStorageSync('userInfo')
            });
        }
    },
    toPersonDatil(e) {
        wx.navigateTo({
            url: '/pages/mine/persondetail/persondetail',
        })
    },

    onShow: function () {


        const app = getApp();
        const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
        if (userInfo) {
            this.setData({ userInfo });
        }

        let userinfo = wx.getStorageSync('userinfo')
        if (userinfo != '') {
            this.setData({
                disabled: false
            })
        }
        else {
            this.setData({
                disabled: true
            })
        }
    },
    onShow() {
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
            this.setData({
                userInfo: userInfo
            });
        }
        if (wx.getStorageSync('userInfo')) {
            this.setData({
                isLoggedIn: true,
                userInfo: wx.getStorageSync('userInfo')
            });
        }
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
        // 清除全局数据中的用户信息
        getApp().globalData.userInfo = null;

        // 清除本地存储中的用户信息
        wx.removeStorageSync('userInfo');

        // 清除本地存储中的用户信息
        wx.removeStorageSync('userinfo');

        // 更新页面状态为未登录
        this.setData({
            isLoggedIn: false,
            userInfo: {}
        });

        // 重新加载数据或执行其他更新页面的逻辑
        this.reloadData();
    },

    // 重新加载数据或执行其他更新页面的逻辑
    reloadData() {
        // 这里可以添加重新加载数据的逻辑，例如重新获取用户信息等
        // 示例：从全局数据或者本地存储中读取用户信息
        const userInfo = getApp().globalData.userInfo || wx.getStorageSync('userInfo');
        if (userInfo) {
            this.setData({
                userInfo: userInfo,
                isLoggedIn: true
            });
        } else {
            this.setData({
                userInfo: {},
                isLoggedIn: false
            });
        }
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


    // 获取用户头像
    chooseAvatar(e) {
        console.log(e)
        this.setData({
            avatarUrl: e.detail.avatarUrl
        })
    },

    // 获取用户昵称
    nickNameInput(e) {
        console.log(e)
        this.setData({
            nickName: e.detail.value
        })
    },

    // 退出登录
    logout() {
        this.setData({
            nickName: '',
            avatarUrl: '',
        })
    }

})