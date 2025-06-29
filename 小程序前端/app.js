// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 初始化云环境
    wx.cloud.init({
      env: 'cloud1-6gzxjy5k59c1f367',
      traceUser: true
    })

    // 登录
    wx.login({
      success: async res => {
        try {
          const userRes = await wx.getUserInfo()
          this.updateUserInfo(userRes.userInfo)
          this.checkUserStatus()
          wx.setStorageSync('loginCode', res.code)
        } catch (error) {
          console.error('登录失败:', error)
          wx.showToast({ title: '登录失败，请重试', icon: 'none' })
        }
      },
      fail: () => {
        wx.showToast({ title: '登录失败，请检查网络', icon: 'none' })
      }
    })

    this.watchUserInfo()
  },
  updateUserInfo(userInfo) {
    this.globalData.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo);
  },
  watchUserInfo() {
    const that = this;
    Object.defineProperty(this.globalData, 'userInfo', {
      set(newVal) {
        this._userInfo = newVal;
        wx.setStorageSync('userInfo', newVal);
      },
      get() {
        return this._userInfo;
      }
    });
  },
  globalData: {
    userInfo: null
  }
})

App({
  globalData: {
    userInfo: null
  }
});

App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 初始化云环境
    wx.cloud.init({
      env: 'cloud1-6gzxjy5k59c1f367',
      traceUser: true
    })

    // 登录
    wx.login({
      success: async res => {
        try {
          const userRes = await wx.getUserInfo()
          this.updateUserInfo(userRes.userInfo)
          this.checkUserStatus()
          wx.setStorageSync('loginCode', res.code)
        } catch (error) {
          console.error('登录失败:', error)
          wx.showToast({ title: '登录失败，请重试', icon: 'none' })
        }
      },
      fail: () => {
        wx.showToast({ title: '登录失败，请检查网络', icon: 'none' })
      }
    })

    this.watchUserInfo()
  },
  globalData: {
    userInfo: null,
    userStatusChangeCallback: null
  },
  updateUserInfo(userInfo) {
    this.globalData.userInfo = userInfo
    wx.setStorageSync('userInfo', userInfo)
  },
  watchUserInfo() {
    this.checkUserStatus()
  },
  setUserStatusChangeCallback(cb) {
    this.globalData.userStatusChangeCallback = cb
  },
  checkUserStatus() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userStatusChangeCallback && this.globalData.userStatusChangeCallback()
    }
  }
})
