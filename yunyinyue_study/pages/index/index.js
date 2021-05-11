import request from '../../utils/request.js'
// var request;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], // 轮播图数据
    personSong: [], // 推荐歌单数据
    topList: [] // 排行榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) { /* async 表明只是一个异步函数，此函数可调用then方法 */
    // request = require('../../utils/request')
    // 轮播图数据
    let bannerListData = await request('/banner', {type:1})  /* 如果await等到的是一个 Promise对象，await 会阻塞后面的代码 ，等待这个异步操作完成后再执行 */
    
    // 歌单数据
    let personSongData = await request('/personalized', {limit: 10})

    // 排行榜数据
    let index = 0;
    let resultArr = []; 
    while(index < 5){
      let topListData = await request('/top/list', {idx: index++})
      // 后端数据太多，手动整合需要的数据
      let topListItem = {
        name: topListData.playlist.name,
        tracks:topListData.playlist.tracks.slice(0,3)
      }
      resultArr.push(topListItem)
      // 发一次请求即拿一次数据，不必等到5次请求完成后再渲染页面，减少白屏，渲染5次，提升用户体验
      this.setData({
        topList: resultArr
      })
    }
    
    // 拿到真实数据
    this.setData({
      bannerList: bannerListData.banners,
      personSong: personSongData.result,
      
    })
    // request('/personalized',{limit: 10}).then(res => {
    //   return personSong= res.result
    // })
  },
  // 跳转推荐页面
  toRecommend() {
    wx.navigateTo({
      url:"/songPackage/pages/recommendSong/recommendSong"
    })
  },
  toOther(){
    wx.navigateTo({
      url:"/otherPackage/pages/other/other"
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