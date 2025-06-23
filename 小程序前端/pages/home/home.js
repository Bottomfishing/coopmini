// pages/home/home.js
Page({

  data: {
    images: [
      "cloud://cloud1-6gzxjy5k59c1f367.636c-cloud1-6gzxjy5k59c1f367-1356239324/images/sw/1.jpg",
      "cloud://cloud1-6gzxjy5k59c1f367.636c-cloud1-6gzxjy5k59c1f367-1356239324/images/sw/2.jpg",
      "cloud://cloud1-6gzxjy5k59c1f367.636c-cloud1-6gzxjy5k59c1f367-1356239324/images/sw/3.jpg"
    ],
    notices: [
      { id: 1, content: '欢迎光临本店！' },
      { id: 2, content: '新用户立享9折优惠！' },
      { id: 3, content: '关注公众号获取更多优惠信息' }
    ]
  },

  navigateToPickup() {
    wx.switchTab({
      url: '/pages/order/order'
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})