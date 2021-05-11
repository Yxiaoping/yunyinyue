import PubSub from 'pubsub-js'
import request from '../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '', // 天
    month: '', // 月
    recommendList: [], // 推荐列表数据
    index: 0 // 点击音乐的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 由于获取数据要携带用户cookie，所以判断用户是否登录
    // 读取用户数据
    let userInfo = wx.getStorageSync('userInfo')
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon:'none',
        success: () => {
          // 跳转至登录页面
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
    }
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1 // 月份从0-11
    })
    // 获取每日推荐数据
    this.getSongList()

    // 订阅来自songDetail发布的消息
    PubSub.subscribe('switchType',(msg,type) => {
      // console.log(msg,type);
      // recommendList是页面通信要获取的数据源
      let {recommendList,index} = this.data;
      if(type === 'pre'){ // 上一首
        (index === 0) && (index = recommendList.length)
        index -= 1
      }else{
        (index === recommendList.length - 1) && (index = -1)
        index += 1
      }
      // 更新下标
      this.setData({
        index
      })
      // 找到切歌后的音乐的id
      let musicId = recommendList[index].id
      // 将id发给detail页面
      PubSub.publish('musicId',musicId)
    })
  },
  async getSongList() {
    let songList = await request('/recommend/songs')
    console.log(songList);
    this.setData({
      recommendList: songList.recommend
    })
  },
  // 跳转至歌曲详情页
  toSongDetail (event) {
    // 利用data-song={{item}},获取到歌曲的所有信息
    // 获取到当前歌曲的下标，给切歌时用
    let {song,index} = event.currentTarget.dataset
    this.setData({
      index
    })
    wx.navigateTo({
      // url中不能含有js的对象或数组
      // song的长度太长，换成传歌曲的id
      // url:'/pages/songDetail/songDetail?song='+ JSON.stringify(song)
      url:'/songPackage/pages/songDetail/songDetail?musicId='+ song.id
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