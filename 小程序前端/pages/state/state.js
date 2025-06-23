// pages/state/state.js
Page({
  /**
   * 页面的初始数据
  //  */
  // data: {
  //   statusData: null,
  //   socketOpen: false,
  //   socketTimer: null
  // },

  /**
   * 生命周期函数--监听页面加载
   */

  // ？？？？？？？？？？
  // onLoad(options) {
  //   wx.connectSocket({
  //     url: 'wss://your-domain.com/ws',
  //     success: () => console.log('WebSocket连接成功'),
  //     fail: err => console.error('连接失败', err)
  //   })
  //   wx.onSocketOpen(() => {
  //     this.setData({ socketOpen: true })
  //     this.startHeartbeat()
  //   })
  //   wx.onSocketMessage(res => {
  //     this.setData({ statusData: JSON.parse(res.data) })
  //   })
  //   wx.onSocketClose(() => {
  //     this.setData({ socketOpen: false })
  //     this.stopHeartbeat()
  //     this.reconnect()
  //   })
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (!this.data.socketOpen) {
      this.reconnect()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.stopHeartbeat()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    wx.closeSocket()
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

  },

  reconnect() {
    setTimeout(() => {
      wx.connectSocket({
        url: 'wss://your-domain.com/ws',
        success: () => console.log('WebSocket重连成功'),
        fail: err => console.error('重连失败', err)
      })
    }, 5000)
  },

  startHeartbeat() {
    this.data.socketTimer = setInterval(() => {
      if (this.data.socketOpen) {
        wx.sendSocketMessage({ data: 'ping' })
      }
    }, 30000)
  },

  stopHeartbeat() {
    clearInterval(this.data.socketTimer)
  }
})