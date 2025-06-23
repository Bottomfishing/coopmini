// pages/cart/cart.js
Page({
  // 页面初始数据
  data: {
    cartItems: [],
    totalPrice: 0
  },

  // 页面加载时加载购物车数据
  onLoad() {
    this.loadCartData()
    const app = getApp()
    app.setUserStatusChangeCallback(() => {
      this.syncCartData()
      this.loadCartData()
    })
  },

  // 加载购物车数据
  async loadCartData() {
    const app = getApp()
    let cartData = []

    if (app.globalData.userInfo) {
      const cloudRes = await wx.cloud.database().collection('cart').get()
      cartData = cloudRes.data
    } else {
      cartData = wx.getStorageSync('cartItems') || []
    }

    // 获取商品详细信息
    const goodsIds = cartData.map(item => item.goodsId)
    let goodsRes = { data: [] }
    try {
      if (goodsIds.length > 0) {
        goodsRes = await wx.cloud.database().collection('goods')
          .where({
            _id: wx.cloud.database().command.in(goodsIds)
          })
          .get()
      }
      console.log('商品查询成功', goodsRes)
    } catch (err) {
      console.error('商品查询失败', err)
      wx.showToast({ title: '商品加载失败', icon: 'none' })
    }

    this.setData({
      cartItems: cartData.map(item => {
        const goods = goodsRes.data.find(g => g._id === item.goodsId) || {}
        return {
          ...item,
          goodsName: goods.name || '未知商品',
          goodsPrice: goods.price || 0,
          goodsImage: goods.image || '/images/default.png'
        }
      })
    }, () => {
      this.calculateTotal()
    })
  },

  // 计算总价
  calculateTotal() {
    const total = this.data.cartItems.reduce((sum, item) => sum + (item.goodsPrice * item.count), 0)
    this.setData({ totalPrice: total.toFixed(2) })
  },

  // 增加商品数量
  increaseQuantity(e) {
    const index = e.currentTarget.dataset.index
    const items = this.data.cartItems
    items[index].count += 1
    this.setData({ cartItems: items }, () => {
      this.calculateTotal()
      this.saveCartData()
    })
  },

  // 减少商品数量
  decreaseQuantity(e) {
    const index = e.currentTarget.dataset.index
    const items = this.data.cartItems
    if (items[index].count > 1) {
      items[index].count -= 1
      this.setData({ cartItems: items }, () => {
        this.calculateTotal()
        this.saveCartData()
      })
    } else {
      const item = items[index]
      items.splice(index, 1)
      this.setData({ cartItems: items }, () => {
        this.calculateTotal()
        this.saveCartData()
        // 从数据库删除商品
        if (getApp().globalData.userInfo) {
          wx.cloud.database().collection('cart').where({
            goodsId: item.goodsId
          }).remove()
        }
      })
    }
  },

  // 删除商品
  async syncCartData() {
    const app = getApp()
    if (app.globalData.userInfo) {
      await wx.cloud.database().collection('cart').remove()
      for (const item of this.data.cartItems) {
        await wx.cloud.database().collection('cart').add({
          data: {
            goodsId: item.goodsId,
            count: item.count
          }
        })
      }
    }
  },

  // 保存购物车数据
  saveCartData() {
    const app = getApp()
    if (!app.globalData.userInfo) {
      wx.setStorageSync('cartItems', this.data.cartItems)
    }
    this.syncCartData()
  }
})