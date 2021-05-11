import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../../utils/request'
// 获取全局实例
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 音乐是否播放
    song: {}, // 歌曲详情对象
    musicId: '', // 音乐的id
    musicLink: '', // 音乐的链接
    currentTime: '00:00', // 实时时间
    durationTime: '00:00', // 总时长
    currentWidth: 0 // 实时进度条的宽度
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.song);
    let musicId = options.musicId
    this.setData({
      musicId
    })
    // console.log(options);
    // console.log(musicId);
    this.getSongDetail(musicId)
    
    // 判断当前页面音乐是否播放，根据全局音乐的播放状态
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
      // 修改当前页面音乐播放状态
      this.setData({
        isPlay: true
      })
    }
      // 创建控制音乐播放的实例
      // let 是块级作用域，放到了if里，else里就访问不到
      // 多处都要使用这一实例，就可将其放到this上
      this.backgroundAudioManager = wx.getBackgroundAudioManager()
      // 监视音乐的播放/暂停/停止
      this.backgroundAudioManager.onPlay(() => {
        console.log('play()');
        // 修改音乐播放的状态
        // this.setData({
        //   isPlay: true
        // })
        this.changePlayState(true)

        // 修改全局音乐播放的状态
        // appInstance.globalData.isMusicPlay = true  封装进了函数里
        appInstance.globalData.musicId = musicId
      })
      this.backgroundAudioManager.onPause(() => {
        console.log('pause()');
        // 修改音乐播放的状态
        // this.setData({
        //   isPlay: false
        // })
        this.changePlayState(false)
        // appInstance.globalData.isMusicPlay = false
      })
      this.backgroundAudioManager.onStop(() => {
        console.log('onStop()');
        // 修改音乐播放的状态
        // this.setData({
        //   isPlay: false
        // })
        this.changePlayState(false)
        // appInstance.globalData.isMusicPlay = false
      })
      // 监听音乐播放结束
      // this.backgroundAudioManager.onEnded(() => {
        // 自动切换到下一首，并自动播放
        PubSub.publish('switchType','next')
        // 将实时进度条的长度、时间还原为0
        this.setData({
          currentWidth: 0,
          currentTime: '00:00'
        })
      // })
      // 监听音乐实时播放的进度条
      this.backgroundAudioManager.onTimeUpdate(() => {
        // console.log('总时长:',this.backgroundAudioManager.duration);
        // console.log('实时时长:',this.backgroundAudioManager.currentTime);
        // 将s转换为ms
        let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
        // 算出实时的进度条长度
        let currentWidth = 450 * (this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration)
        this.setData({
          currentTime,
          currentWidth
        })
      })
  },
  // 修改播放状态的功能函数
  changePlayState(isPlay){
    this.setData({
      isPlay: isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay
  },
  // 获取音乐详情
  async getSongDetail(musicId) {
    let songDetail = await request('/song/detail', {ids: musicId})
    // songDetail.song[0].dt 单位ms
    let durationTime = moment(songDetail.songs[0].dt).format('mm:ss')
    this.setData({
      song:songDetail.songs[0],
      durationTime
    })
    // 动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },
  // 点击播放/暂停的回调
  handlePlay () {
    let isPlay = !this.data.isPlay
    // 由于控制音频的实例已经对播放状态进行了修改，此处就不用修改了
    // this.setData({
    //   isPlay
    // })
    let {musicId,musicLink} = this.data
    this.musicControl(isPlay, musicId,musicLink)
  },
  // 控制音乐播放/暂停的功能函数
  async musicControl(isPlay,musicId,musicLink){
    if(isPlay){ // 音乐播放
      if(!musicLink){
        // 获取音乐的播放链接
        let musicLinkData = await request('/song/url',{id: musicId})
        musicLink = musicLinkData.data[0].url
        this.setData({
          musicLink
        })
      }

      this.backgroundAudioManager.src = musicLink
      this.backgroundAudioManager.title = this.data.song.name
    }else{ // 音乐暂停
      this.backgroundAudioManager.pause()
    }
  },
  // 点击切歌的回调
  handleSwitch(event) {
    // 获取切歌的类型
    let type = event.currentTarget.id
    // 关闭当前播放的音乐
    this.backgroundAudioManager.pause()
    // 发布消息给recommend页面
    PubSub.publish('switchType',type)
    // 订阅来自recommend的id数据
    PubSub.subscribe('musicId',(msg,musicId) => {
      console.log(musicId);
      // 获取音乐详情
      this.getSongDetail(musicId)
      // 自动播放音乐
      this.musicControl(true,musicId)
      // 订阅一次成功后取消订阅
      PubSub.unsubscribe('musicId')
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