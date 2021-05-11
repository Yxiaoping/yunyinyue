import request from '../../utils/request'

let startY = 0; // 手指起始的坐标
let moveY = 0; // 手指移动的坐标
let moveDistance = 0; // 手指移动的距离

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coverTransition: '',
    userInfo: {}, // 用户信息，页面上展示的信息都要从data中获取
    recentPlayList: [] // 用户的播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 读取用户的基本信息
    let userInfo = wx.getStorageSync('userInfo')
    console.log("userInfo:"+userInfo);
    if(userInfo){
      // 更新data中的数据
      this.setData({
        userInfo:JSON.parse(userInfo)
      })
      // 获取用户播放记录
      this.getRecentPlayList(this.data.userInfo.userId)
    }
  },
// 获取用户播放记录的功能函数
  async getRecentPlayList(userId){
    let recentPlay = await request('/user/record',{uid:userId,type:1})
    // 为数组添加一个id
    let index = 0
    let recentPlayList = recentPlay.weekData.slice(0,10).map(item => {
      item.id = index++
      return item
    })
      this.setData({
        recentPlayList
      })
  },

  handleTouchStart(event) {
    // 手指点击时清空过渡效果
    this.setData({
      coverTransition: ''
    })
    // 获取手指的起始坐标
    startY = event.touches[0].clientY // touches获取手指点击的元素，可能一个或多个手指同时点击屏幕，所以为数组
  },
  handleTouchMove(event) {
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY
    // console.log(moveDistance);
    // 不能向上移动
    if(moveDistance <= 0){
      return;
    }
    if(moveDistance > 80){
      moveDistance = 80
    }
    // 动态更新coverTransform的值
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd() {
    this.setData({
      coverTransform: 'translateY(0)',
      // 设置返回时平滑过渡
      coverTransition: 'transform 0.5s linear'
    })
  },

  // 跳转至登录login页面的回调
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})