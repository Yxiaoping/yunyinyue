// pages/search/search.js
import request from '../../utils/request'
let isSend;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', // placeholder的内容
    hotList: [], // 热搜榜数据
    searchContent: '', // 表单项内容
    searchList: [], // 关键字模糊匹配的数据
    historyList: [] // 搜索历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取初始化数据
    this.getPlaceholder()
    // 获取本地历史记录的功能函数
    this.getHistory()
  },
  
  // 获取本地历史记录的功能函数
  getHistory(){
    let historyList = wx.getStorageSync('searchHistory')
    // 有值才更新
    if(historyList){
    this.setData({
      historyList
    })
  }
  },
  // 获取初始化数据
  async getPlaceholder() {
    let placeholderData = await request('/search/default')
    let hotList = await request('/search/hot/detail')
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList:hotList.data
    })
  },
  // 表单项内容发生改变的回调
  handleInputChange(event){
    // console.log(event);
    // 更新表单项内容
    this.setData({
      searchContent: event.detail.value.trim()
    })
    // if(isSend){
    //   return
    // }
    // isSend = true
    // this.getSearchList()
    // // 节流，300ms发送一次请求
    // setTimeout(() => {
    //   isSend = false
    // },300)
    if(!isSend){
      isSend = setTimeout(() => {
        isSend = null;
        this.getSearchList()
      },300)
    }
  },
  // 获取搜索数据的功能函数
  async getSearchList(){
    // 表单项内容为空时，不发送请求
    if(!this.data.searchContent){
      this.setData({
        searchList: []
      })
      return
    }
    let {searchContent,historyList} = this.data
    // 发请求获取关键字模糊匹配数据
    let searchListData = await request('/search',{keywords:searchContent,limit:10})
    this.setData({
      searchList: searchListData.result.songs
    })
    // 将搜索的关键字添加到搜索历史记录中
    // 先判断记录中是否有一样的值，没有才添加
    if(historyList.indexOf(searchContent) !== -1){
      historyList.splice(historyList.indexOf(searchContent),1)
    }
    historyList.unshift(searchContent)
    this.setData({
      historyList
    })
    // 将数据存储到本地，防止用户一刷新数据就没了
    wx.setStorageSync('searchHistory',historyList)
  },
  // 清空搜索内容
  clearSearchContent (){
    this.setData({
      searchContent: '',
      searchList: []
    })
  },
  // 删除搜索历史记录
  deleteSearchHistory(){
    wx.showModal({
      content: "确认删除吗？",
      success: (res) => {
        console.log(res);
        if(res.confirm){ //同意删除
          this.setData({
          historyList: []
        })
        // 移除本地的历史记录缓存
        wx.removeStorageSync('searchHistory')
        }
      }
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