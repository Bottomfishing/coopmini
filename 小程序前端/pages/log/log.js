Page({
  data: {
    hasUserInfo: false,
    userInfo: {},
    avatarUrl: '',
    nickName: '',
    studentId: '',
    studentIdError: false,
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

  // 处理学号输入
  bindStudentIdInput(e) {
    this.setData({
      studentId: e.detail.value
    });
  },

  // 导航到个人中心页面

  navigateToPerson() {
    if (this.data.isSubmitting) return;
    const app = getApp();
    const { avatarUrl, nickName, studentId, gender } = this.data;
    // 同步用户信息到全局状态和本地存储
    const userInfo = {
      avatarUrl,
      nickName,
      studentId,
      gender
    };
    app.globalData.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo);
    // 跳转到个人中心页面（tabBar页面使用switchTab）
    wx.setStorage({
      key: 'userInfo',
      data: userInfo,
      success: () => {
        wx.switchTab({ url: '/pages/person/person' });
      }
    });
  }

});
