// pages/login/login.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    phone: '', // 手机号
    password: '' // 用户密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 表单项内容发生改变的回调
  handleInput (event) {
    // console.log(event);  表单项的数据
    // console.log(event.detail.value); 
    // 1. 利用id区分两个表单项
    // let type = event.currentTarget.id; // 设置的id值，phohe | password
    // 2. 利用data-type区分两个表单项
    let type = event.currentTarget.dataset.type
    // console.log(type);
    // 由于data中表单项的数据值和type值一致，所以可以直接通过type设置数据值
    this.setData({
      [type]: event.detail.value
    })
  },

  // 登录的回调
  async login () {
    // 1. 收集表单项数据
    let { phone, password } = this.data;
    // 2. 前端验证
    // 2.1 验证手机号
    if(!phone){
      // 提示用户
      wx.showToast({
        title: '请输入手机号！',
        icon: 'none'
      })
      return; // 因为wx.showToast是一个异步任务，有成功失败的回调，保险起见截掉它
    }
    // 定义正则表达式
    let phoneReg = /^1[3-9][0-9]{9}$/
    // let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return;
    } 
    // 2.2 验证密码
    if(!password){
      wx.showToast({
        title: "请输入密码",
        icon: 'none'
      })
      return;
    }
    // 后端验证
    let result = await request('/login/cellphone',{phone,password, isLogin:true})
    // isLogin是只有登录请求才携带的数据，可用于判断登录请求成功与否
    // 如果验证成功
    if(result.code === 200){
      // 验证通过
    wx.showToast({
      titel: "登录成功"
    })
    // 登录成功跳转至个人中心页面（携带id和密码）
    // 1. 先将用户的信息存储至本地
    wx.setStorageSync('userInfo', JSON.stringify(result.profile))
    // navigateTo 不能跳转至tabbar页面
    wx.reLaunch({
      url: '/pages/personal/personal'
    })
    }else if(result.code === 400){
      wx.showToast({
        title: "手机号输入错误",
        icon: 'none'
      })
    }else if(result.code === 502){
      wx.showToast({
        title: "密码输入错误",
        icon: 'none'
      })
    }else{
      wx.showToast({
        title: "登录失败，请重新登录",
        icon: 'none'
      })
    }
    


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