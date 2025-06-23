Page({
  data: {
    hasUserInfo: false,
    userInfo: {}
  },

  // 登录方法
  login() {
    const app = getApp();
    wx.getUserProfile({ // 使用微信提供的接口获取用户信息
      desc: '用于完善会员资料',
      success: (res) => {
        this.setData({ 
          hasUserInfo: true,
          userInfo: res.userInfo 
        });
        app.globalData.userInfo = res.userInfo; // 保存到全局数据
        wx.setStorageSync('userInfo', res.userInfo); // 保存到本地存储
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
        wx.showToast({ // 提示用户获取失败
          title: '获取用户信息失败',
          icon: 'none'
        });
      }
    });

    // 检查授权状态？
    wx.getSetting({ 
        success(res) { 
            console.log(res.authSetting); 
        }
    });
  },

  // 退出登录方法
  logout() {
    const app = getApp();
    this.setData({ 
      hasUserInfo: false,
      userInfo: {} 
    });
    // 清除全局数据
    app.globalData.userInfo = null;
    // 清除本地存储
    wx.removeStorageSync('userInfo');
  }
});