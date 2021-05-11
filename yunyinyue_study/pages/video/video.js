import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], //导航标签数据
    navId: '', // 导航的标识
    videoList: [], //视频列表数据
    videoId: '', //视频的id标识
    videoUpdataTime: [], //记录video播放的时长
    isTriggered: false  // 标识下拉刷新是否被触发
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取导航数据
    this.getVideoData()
    console.log(this.data.navId, '222');  // 返回值没有id，并且222先于111打印
  },
  // 获取导航数据
  async getVideoData() {
    let videoGroupList = await request('/video/group/list')
    this.setData({
      videoGroupList:videoGroupList.data.slice(0,14),
      navId:videoGroupList.data[0].id // 默认显示第一个数据的样式
    })
    console.log(this.data.navId, '111'); // 此时返回值为id和111，在222之后打印
    // 获取视频列表数据
    this.getVideoList(this.data.navId)
  },
  // 获取视频列表数据
  async getVideoList(navId){
    let videoListData = await request('/video/group',{id: navId})
    if(videoListData.datas.length === 0){
        wx.showToast({
            title: '暂无推荐视频',
            icon: 'none'
        })
    }
    // 获取到视频列表数据，即隐藏loading提示
    wx.hideLoading();
    // console.log(videoListData);
    let index = 0;
    let newVideoList = videoListData.datas.map(item => {
      item.id = index++
      return item
    })
    this.setData({
      videoList:newVideoList,
      // 获取完数据后关闭下拉刷新
      isTriggered: false
    })
  },
  // 点击切换导航
  changeNav(event) {
    let navId = event.currentTarget.id // 通过id向event传参的时候如果传的是number，则会自动转换成string
    this.setData({
      navId: navId*1, // navId 为字符串，要将其转为数值
    // 点击nav切换时，将旧数据清空
      videoList: []
    })
    // 视频数据太大，容易白屏，先显示正在加载
    wx.showLoading({
      title: "正在加载"
    })
    // 动态获取当前导航对应的视频
    this.getVideoList(this.data.navId)
  },
  // 点击播放/继续播放的回调
  handlePlay (event) {
    // 找到video的唯一标识vid
    let vid = event.currentTarget.id
    // 利用图片优化后，页面只有一个视频，就没有了多个视频同时播放的bug，此时代码可删
    // this.vid !== vid && this.videoContext && this.videoContext.stop()
    // this.vid = vid
    this.setData({ // 保存目前点击的视频的id
      videoId: vid
    })
    // 创建控制video标签的实例对象
    this.videoContext = wx.createVideoContext(vid)
    // 判断当前视频是否被播放过
    let {videoUpdataTime} = this.data
    let videoItem = videoUpdataTime.find(item => item.vid === vid)
    // 如果有，则跳转播放
    if(videoItem){
      this.videoContext.seek(videoItem.currentTime)
    }else{
    // 点击图片后利用video的实例对象方法让视频自动播放
    this.videoContext.play()}
  },
  // 监听视频播放进度的回调
  handleTimeUpdate(event){
    // console.log(event);
    let videoTimeObj = {vid: event.currentTarget.id, currentTime: event.detail.currentTime}
    let {videoUpdataTime} = this.data
    // 判断数组中是否有当前视频的播放记录
    let videoItem = videoUpdataTime.find(item => item.vid === videoTimeObj.vid)
    // 如果有，修改时间
    if(videoItem){
      videoItem.currentTime = videoTimeObj.currentTime
    }else{
      videoUpdataTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdataTime
    })
  },
  // 视频播放结束的回调
  handleEnded(event){
    console.log('ended');
    // 移出数组中当前视频对象
    let {videoUpdataTime} = this.data
    videoUpdataTime.splice(videoUpdataTime.findIndex(item => item.vid===event.currentTarget.id), 1)
    this.setData({
      videoUpdataTime
    })
  },
  // 自定义下拉刷新的回调：scroll-view
  handleRefresher() {
    // console.log('refresh');
    this.setData({
      isTriggered:true
    })
    // 发送请求，获取数据
    this.getVideoList(this.data.navId)
  },
  // 自定义上拉加载的回调：scroll-view
  handleToLower() {
    // console.log('tolower');
    // 模拟数据
    let newVideoList = [
          {
              "type": 1,
              "displayed": false,
              "alg": "onlineHotGroup",
              "extAlg": null,
              "data": {
                  "alg": "onlineHotGroup",
                  "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                  "threadId": "R_VI_62_427BB203534A1F507CE32E0D1267C96C",
                  "coverUrl": "https://p1.music.126.net/tOa2aqer4bOy0H2jGrfddQ==/109951163789326998.jpg",
                  "height": 720,
                  "width": 1280,
                  "title": "Bridge 跑车里 法拉利 人民币 靠自己",
                  "description": "Bridge布瑞吉/K11 - 老大 - 20190104 新大陆 广州站",
                  "commentCount": 614,
                  "shareCount": 1820,
                  "resolutions": [
                      {
                          "resolution": 240,
                          "size": 57191982
                      },
                      {
                          "resolution": 480,
                          "size": 101524413
                      },
                      {
                          "resolution": 720,
                          "size": 135855174
                      }
                  ],
                  "creator": {
                      "defaultAvatar": false,
                      "province": 440000,
                      "authStatus": 0,
                      "followed": false,
                      "avatarUrl": "http://p1.music.126.net/O_vfmrX_LtXfvvuqKgJVwQ==/109951165189732405.jpg",
                      "accountStatus": 0,
                      "gender": 1,
                      "city": 440100,
                      "birthday": -2209017600000,
                      "userId": 59148850,
                      "userType": 0,
                      "nickname": "santinooo",
                      "signature": "生於世上無目的鞭撻",
                      "description": "",
                      "detailDescription": "",
                      "avatarImgId": 109951165189732400,
                      "backgroundImgId": 109951163132305470,
                      "backgroundUrl": "http://p1.music.126.net/zdT0smXzAYz7kx7yXM-nag==/109951163132305479.jpg",
                      "authority": 0,
                      "mutual": false,
                      "expertTags": null,
                      "experts": null,
                      "djStatus": 0,
                      "vipType": 11,
                      "remarkName": null,
                      "avatarImgIdStr": "109951165189732405",
                      "backgroundImgIdStr": "109951163132305479"
                  },
                  "urlInfo": {
                      "id": "427BB203534A1F507CE32E0D1267C96C",
                      "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/p3xzNw6x_2248528412_shd.mp4?ts=1620551238&rid=DD937CC654050575FF7A81D6FB872D4F&rl=3&rs=dcaOZJnWnJeAUlwFdGBpsBPoWxyOYZiQ&sign=b0d64b5d5166f3b8cb570f32c5111bff&ext=ohIcjnk1LeaprHwckflExYWZmr7r%2BdrQd0T4vmTirWGPDEYILwLX9DUHBMJMEtHSK%2B0aPJYtVB2rasjJgpsP03AjZQGJyEnhKEVR1J%2BAnXqLhn7FfJdHaan3NfYNYv27DEEIvZRSWyTrqjH3ny0F%2Bf8aspxE6FbMpN6bi0EegG14ZEMrRHiQ%2Fosan52l1pzPv%2F11o2UwD753e1DVE3H6Upg490A51qtkpFBkVeoX0PBT6h%2FRHdT9TS56cJMSp43R",
                      "size": 135855174,
                      "validityTime": 1200,
                      "needPay": false,
                      "payInfo": null,
                      "r": 720
                  },
                  "videoGroup": [
                      {
                          "id": 58100,
                          "name": "现场",
                          "alg": null
                      },
                      {
                          "id": 1101,
                          "name": "舞蹈",
                          "alg": null
                      },
                      {
                          "id": 59101,
                          "name": "华语现场",
                          "alg": null
                      },
                      {
                          "id": 57110,
                          "name": "饭拍现场",
                          "alg": null
                      },
                      {
                          "id": 1100,
                          "name": "音乐现场",
                          "alg": null
                      },
                      {
                          "id": 5100,
                          "name": "音乐",
                          "alg": null
                      },
                      {
                          "id": 74116,
                          "name": "Hiphop",
                          "alg": null
                      }
                  ],
                  "previewUrl": null,
                  "previewDurationms": 0,
                  "hasRelatedGameAd": false,
                  "markTypes": null,
                  "relateSong": [],
                  "relatedInfo": null,
                  "videoUserLiveInfo": null,
                  "vid": "427BB203534A1F507CE32E0D1267C96C",
                  "durationms": 266000,
                  "playTime": 2180486,
                  "praisedCount": 13020,
                  "praised": false,
                  "subscribed": false
              }
          },
          {
              "type": 1,
              "displayed": false,
              "alg": "onlineHotGroup",
              "extAlg": null,
              "data": {
                  "alg": "onlineHotGroup",
                  "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                  "threadId": "R_VI_62_F519FC453B876BF06FABB1168DEB5CFC",
                  "coverUrl": "https://p1.music.126.net/TugwOIVrOrxAou9VI03bbw==/109951163574193004.jpg",
                  "height": 720,
                  "width": 1280,
                  "title": "当年超红的“韩流女神”，这首歌的旋律一出，全场尖叫！",
                  "description": "当年超红的“韩流女神”，她还未亮相，这首歌旋律一出，全场尖叫！",
                  "commentCount": 920,
                  "shareCount": 850,
                  "resolutions": [
                      {
                          "resolution": 240,
                          "size": 27020407
                      },
                      {
                          "resolution": 480,
                          "size": 46440502
                      },
                      {
                          "resolution": 720,
                          "size": 58516283
                      }
                  ],
                  "creator": {
                      "defaultAvatar": false,
                      "province": 340000,
                      "authStatus": 0,
                      "followed": false,
                      "avatarUrl": "http://p1.music.126.net/C6VID_CReqmt8ETsUWaYTQ==/18499283139231828.jpg",
                      "accountStatus": 0,
                      "gender": 0,
                      "city": 340100,
                      "birthday": -2209017600000,
                      "userId": 479954154,
                      "userType": 201,
                      "nickname": "音乐诊疗室",
                      "signature": "当我坐在那架破旧古钢琴旁边的时候，我对最幸福的国王也不羡慕。（合作推广请私信，或者+V信：mjs927721）",
                      "description": "",
                      "detailDescription": "",
                      "avatarImgId": 18499283139231828,
                      "backgroundImgId": 1364493978647983,
                      "backgroundUrl": "http://p1.music.126.net/i4J_uvH-pb4sYMsh4fgQAA==/1364493978647983.jpg",
                      "authority": 0,
                      "mutual": false,
                      "expertTags": null,
                      "experts": {
                          "1": "音乐视频达人",
                          "2": "音乐资讯达人"
                      },
                      "djStatus": 0,
                      "vipType": 0,
                      "remarkName": null,
                      "avatarImgIdStr": "18499283139231828",
                      "backgroundImgIdStr": "1364493978647983"
                  },
                  "urlInfo": {
                      "id": "F519FC453B876BF06FABB1168DEB5CFC",
                      "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/v2PQmcPt_1891355673_shd.mp4?ts=1620551238&rid=DD937CC654050575FF7A81D6FB872D4F&rl=3&rs=wBtQuENBTZGdPPMzpxXbRBWCokzbYTju&sign=e166138e1b266f03d48d90c8bf1a9e58&ext=ohIcjnk1LeaprHwckflExYWZmr7r%2BdrQd0T4vmTirWGPDEYILwLX9DUHBMJMEtHSK%2B0aPJYtVB2rasjJgpsP03AjZQGJyEnhKEVR1J%2BAnXqLhn7FfJdHaan3NfYNYv27DEEIvZRSWyTrqjH3ny0F%2Bf8aspxE6FbMpN6bi0EegG14ZEMrRHiQ%2Fosan52l1pzPv%2F11o2UwD753e1DVE3H6Upg490A51qtkpFBkVeoX0PBT6h%2FRHdT9TS56cJMSp43R",
                      "size": 58516283,
                      "validityTime": 1200,
                      "needPay": false,
                      "payInfo": null,
                      "r": 720
                  },
                  "videoGroup": [
                      {
                          "id": 58100,
                          "name": "现场",
                          "alg": null
                      },
                      {
                          "id": 57107,
                          "name": "韩语现场",
                          "alg": null
                      },
                      {
                          "id": 57108,
                          "name": "流行现场",
                          "alg": null
                      },
                      {
                          "id": 59108,
                          "name": "巡演现场",
                          "alg": null
                      },
                      {
                          "id": 1100,
                          "name": "音乐现场",
                          "alg": null
                      },
                      {
                          "id": 12100,
                          "name": "流行",
                          "alg": null
                      },
                      {
                          "id": 5100,
                          "name": "音乐",
                          "alg": null
                      },
                      {
                          "id": 16238,
                          "name": "浪漫",
                          "alg": null
                      }
                  ],
                  "previewUrl": null,
                  "previewDurationms": 0,
                  "hasRelatedGameAd": false,
                  "markTypes": null,
                  "relateSong": [],
                  "relatedInfo": null,
                  "videoUserLiveInfo": null,
                  "vid": "F519FC453B876BF06FABB1168DEB5CFC",
                  "durationms": 224723,
                  "playTime": 927100,
                  "praisedCount": 4292,
                  "praised": false,
                  "subscribed": false
              }
          },
          {
              "type": 1,
              "displayed": false,
              "alg": "onlineHotGroup",
              "extAlg": null,
              "data": {
                  "alg": "onlineHotGroup",
                  "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                  "threadId": "R_VI_62_87EF6CDF21866FC13A1E4E1BBB5A8A34",
                  "coverUrl": "https://p2.music.126.net/xYe8FGOyhgc49fvzUNMKwQ==/109951163834673913.jpg",
                  "height": 360,
                  "width": 640,
                  "title": "日本音乐人 Aimyon《她曾活过啊》现场版",
                  "description": "日本音乐人 Aimyon《她曾活过啊》现场版 \n\n说什么把握当下，生命要活得精彩，只是漂亮话罢了\n拿出全部的勇气，她纵身一跃飞过天空\n\n每一位离世的人，都曾在这个世界活过啊\n\n",
                  "commentCount": 1167,
                  "shareCount": 3428,
                  "resolutions": [
                      {
                          "resolution": 240,
                          "size": 12637795
                      }
                  ],
                  "creator": {
                      "defaultAvatar": false,
                      "province": 350000,
                      "authStatus": 0,
                      "followed": false,
                      "avatarUrl": "http://p1.music.126.net/GtIXN9Bpk7eGcGtXwMZfRA==/6634453162191982.jpg",
                      "accountStatus": 0,
                      "gender": 1,
                      "city": 350500,
                      "birthday": 680198400000,
                      "userId": 34652764,
                      "userType": 204,
                      "nickname": "乌托邦电台",
                      "signature": "知名音乐自媒体，新浪微博@乌托邦电台 （宣传、品牌合作请私信）",
                      "description": "",
                      "detailDescription": "",
                      "avatarImgId": 6634453162191982,
                      "backgroundImgId": 109951163156242990,
                      "backgroundUrl": "http://p1.music.126.net/x2MDv3VHl-59oDc1MTYmPQ==/109951163156242986.jpg",
                      "authority": 0,
                      "mutual": false,
                      "expertTags": null,
                      "experts": {
                          "1": "音乐视频达人",
                          "2": "华语音乐资讯达人"
                      },
                      "djStatus": 10,
                      "vipType": 11,
                      "remarkName": null,
                      "avatarImgIdStr": "6634453162191982",
                      "backgroundImgIdStr": "109951163156242986"
                  },
                  "urlInfo": {
                      "id": "87EF6CDF21866FC13A1E4E1BBB5A8A34",
                      "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/4qwxfKor_2288590654_sd.mp4?ts=1620551238&rid=DD937CC654050575FF7A81D6FB872D4F&rl=3&rs=EoTDMazhmPouRxttRiwjwSuwWnSxXjaZ&sign=1d4c0d4be33ea471945652225f850924&ext=ohIcjnk1LeaprHwckflExYWZmr7r%2BdrQd0T4vmTirWGPDEYILwLX9DUHBMJMEtHSK%2B0aPJYtVB2rasjJgpsP03AjZQGJyEnhKEVR1J%2BAnXqLhn7FfJdHaan3NfYNYv27DEEIvZRSWyTrqjH3ny0F%2Bf8aspxE6FbMpN6bi0EegG14ZEMrRHiQ%2Fosan52l1pzPv%2F11o2UwD753e1DVE3H6Upg490A51qtkpFBkVeoX0PBT6h%2FRHdT9TS56cJMSp43R",
                      "size": 12637795,
                      "validityTime": 1200,
                      "needPay": false,
                      "payInfo": null,
                      "r": 240
                  },
                  "videoGroup": [
                      {
                          "id": 58100,
                          "name": "现场",
                          "alg": null
                      },
                      {
                          "id": 60101,
                          "name": "日语现场",
                          "alg": null
                      },
                      {
                          "id": 57108,
                          "name": "流行现场",
                          "alg": null
                      },
                      {
                          "id": 59108,
                          "name": "巡演现场",
                          "alg": null
                      },
                      {
                          "id": 1100,
                          "name": "音乐现场",
                          "alg": null
                      },
                      {
                          "id": 5100,
                          "name": "音乐",
                          "alg": null
                      }
                  ],
                  "previewUrl": null,
                  "previewDurationms": 0,
                  "hasRelatedGameAd": false,
                  "markTypes": null,
                  "relateSong": [
                      {
                          "name": "生きていたんだよな",
                          "id": 443875380,
                          "pst": 0,
                          "t": 0,
                          "ar": [
                              {
                                  "id": 1053279,
                                  "name": "あいみょん",
                                  "tns": [],
                                  "alias": []
                              }
                          ],
                          "alia": [
                              "日剧《只想住在吉祥寺吗?》片头曲"
                          ],
                          "pop": 100,
                          "st": 0,
                          "rt": null,
                          "fee": 1,
                          "v": 22,
                          "crbt": null,
                          "cf": "",
                          "al": {
                              "id": 35022124,
                              "name": "生きていたんだよな",
                              "picUrl": "http://p3.music.126.net/QvGlOYCfXWx94a19_lmh5A==/3315027565433501.jpg",
                              "tns": [],
                              "pic": 3315027565433501
                          },
                          "dt": 194168,
                          "h": {
                              "br": 320000,
                              "fid": 0,
                              "size": 7767815,
                              "vd": -42600
                          },
                          "m": {
                              "br": 192000,
                              "fid": 0,
                              "size": 4660706,
                              "vd": -40100
                          },
                          "l": {
                              "br": 128000,
                              "fid": 0,
                              "size": 3107152,
                              "vd": -38700
                          },
                          "a": null,
                          "cd": "1",
                          "no": 1,
                          "rtUrl": null,
                          "ftype": 0,
                          "rtUrls": [],
                          "djId": 0,
                          "copyright": 0,
                          "s_id": 0,
                          "rtype": 0,
                          "rurl": null,
                          "mst": 9,
                          "cp": 7002,
                          "mv": 10851383,
                          "publishTime": 1480435200007,
                          "tns": [
                              "她曾活过啊"
                          ],
                          "privilege": {
                              "id": 443875380,
                              "fee": 1,
                              "payed": 0,
                              "st": 0,
                              "pl": 0,
                              "dl": 0,
                              "sp": 0,
                              "cp": 0,
                              "subp": 0,
                              "cs": false,
                              "maxbr": 320000,
                              "fl": 0,
                              "toast": false,
                              "flag": 1028,
                              "preSell": false
                          }
                      }
                  ],
                  "relatedInfo": null,
                  "videoUserLiveInfo": null,
                  "vid": "87EF6CDF21866FC13A1E4E1BBB5A8A34",
                  "durationms": 188024,
                  "playTime": 1762390,
                  "praisedCount": 18398,
                  "praised": false,
                  "subscribed": false
              }
          },
          {
              "type": 1,
              "displayed": false,
              "alg": "onlineHotGroup",
              "extAlg": null,
              "data": {
                  "alg": "onlineHotGroup",
                  "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                  "threadId": "R_VI_62_0C0AD6976A8E35B9F56DB86461817F1C",
                  "coverUrl": "https://p1.music.126.net/oFv1tcASrxNjlwtXd7F-Bg==/109951163571974975.jpg",
                  "height": 540,
                  "width": 960,
                  "title": "泰坦尼克号主题曲《我心永恒》最震撼的一次现场",
                  "description": null,
                  "commentCount": 1259,
                  "shareCount": 5645,
                  "resolutions": [
                      {
                          "resolution": 240,
                          "size": 29266752
                      },
                      {
                          "resolution": 480,
                          "size": 52757203
                      }
                  ],
                  "creator": {
                      "defaultAvatar": false,
                      "province": 110000,
                      "authStatus": 0,
                      "followed": false,
                      "avatarUrl": "http://p1.music.126.net/KKt5S0b-gmLTL101uiRo8g==/109951162897260158.jpg",
                      "accountStatus": 0,
                      "gender": 1,
                      "city": 110101,
                      "birthday": -2209017600000,
                      "userId": 387975153,
                      "userType": 0,
                      "nickname": "欧美缪贼客",
                      "signature": "It`s live show time.",
                      "description": "",
                      "detailDescription": "",
                      "avatarImgId": 109951162897260160,
                      "backgroundImgId": 109951162897264020,
                      "backgroundUrl": "http://p1.music.126.net/SOQACChXVHqICTFa2pMcmw==/109951162897264014.jpg",
                      "authority": 0,
                      "mutual": false,
                      "expertTags": null,
                      "experts": null,
                      "djStatus": 0,
                      "vipType": 0,
                      "remarkName": null,
                      "avatarImgIdStr": "109951162897260158",
                      "backgroundImgIdStr": "109951162897264014"
                  },
                  "urlInfo": {
                      "id": "0C0AD6976A8E35B9F56DB86461817F1C",
                      "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/7S9YypWF_1908184_hd.mp4?ts=1620551238&rid=DD937CC654050575FF7A81D6FB872D4F&rl=3&rs=BkmgvHViCgpjdCyKSEycFeTDpqVahAib&sign=3ab72b0b8466af91d788f3d78fb32961&ext=ohIcjnk1LeaprHwckflExYWZmr7r%2BdrQd0T4vmTirWGPDEYILwLX9DUHBMJMEtHSK%2B0aPJYtVB2rasjJgpsP03AjZQGJyEnhKEVR1J%2BAnXqLhn7FfJdHaan3NfYNYv27DEEIvZRSWyTrqjH3ny0F%2Bf8aspxE6FbMpN6bi0EegG14ZEMrRHiQ%2Fosan52l1pzPv%2F11o2UwD753e1DVE3H6Upg490A51qtkpFBkVeoX0PBT6h%2FRHdT9TS56cJMSp43R",
                      "size": 52757203,
                      "validityTime": 1200,
                      "needPay": false,
                      "payInfo": null,
                      "r": 480
                  },
                  "videoGroup": [
                      {
                          "id": 58100,
                          "name": "现场",
                          "alg": null
                      },
                      {
                          "id": 1100,
                          "name": "音乐现场",
                          "alg": null
                      },
                      {
                          "id": 5100,
                          "name": "音乐",
                          "alg": null
                      },
                      {
                          "id": 25137,
                          "name": "音乐资讯",
                          "alg": null
                      }
                  ],
                  "previewUrl": null,
                  "previewDurationms": 0,
                  "hasRelatedGameAd": false,
                  "markTypes": [
                      109
                  ],
                  "relateSong": [],
                  "relatedInfo": null,
                  "videoUserLiveInfo": null,
                  "vid": "0C0AD6976A8E35B9F56DB86461817F1C",
                  "durationms": 404000,
                  "playTime": 1997708,
                  "praisedCount": 14127,
                  "praised": false,
                  "subscribed": false
              }
          },
          {
              "type": 1,
              "displayed": false,
              "alg": "onlineHotGroup",
              "extAlg": null,
              "data": {
                  "alg": "onlineHotGroup",
                  "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                  "threadId": "R_VI_62_AA48F6255D6C77DB007EEEC9C8C330A3",
                  "coverUrl": "https://p1.music.126.net/4J4O698ovZA1E9K2V36AhA==/109951164368383592.jpg",
                  "height": 720,
                  "width": 1280,
                  "title": "胡夏baby王彦霖白队合唱团现场演绎《凤凰花开的路口》",
                  "description": "胡夏baby王彦霖白队合唱团现场演绎《凤凰花开的路口》",
                  "commentCount": 822,
                  "shareCount": 6213,
                  "resolutions": [
                      {
                          "resolution": 240,
                          "size": 52770118
                      },
                      {
                          "resolution": 480,
                          "size": 75574382
                      },
                      {
                          "resolution": 720,
                          "size": 109944083
                      }
                  ],
                  "creator": {
                      "defaultAvatar": false,
                      "province": 320000,
                      "authStatus": 0,
                      "followed": false,
                      "avatarUrl": "http://p1.music.126.net/Ys64W8M8HryrSGn2cOE6cQ==/109951165490336559.jpg",
                      "accountStatus": 0,
                      "gender": 1,
                      "city": 320900,
                      "birthday": 384451200000,
                      "userId": 433941792,
                      "userType": 204,
                      "nickname": "希纯小筑",
                      "signature": "一起来感受音乐的魅力吧！",
                      "description": "",
                      "detailDescription": "",
                      "avatarImgId": 109951165490336560,
                      "backgroundImgId": 109951165071313500,
                      "backgroundUrl": "http://p1.music.126.net/fJ2f9UnADxzZyXE9AKKkCQ==/109951165071313501.jpg",
                      "authority": 0,
                      "mutual": false,
                      "expertTags": null,
                      "experts": {
                          "1": "音乐视频达人"
                      },
                      "djStatus": 10,
                      "vipType": 0,
                      "remarkName": null,
                      "avatarImgIdStr": "109951165490336559",
                      "backgroundImgIdStr": "109951165071313501"
                  },
                  "urlInfo": {
                      "id": "AA48F6255D6C77DB007EEEC9C8C330A3",
                      "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/SdB6z2iJ_2632565188_shd.mp4?ts=1620551238&rid=DD937CC654050575FF7A81D6FB872D4F&rl=3&rs=hBjUuqcNfVNmHZPXXpmuanAEMMgIgvpi&sign=a185dd452851511793cb3784e7ccdbae&ext=ohIcjnk1LeaprHwckflExYWZmr7r%2BdrQd0T4vmTirWGPDEYILwLX9DUHBMJMEtHSK%2B0aPJYtVB2rasjJgpsP03AjZQGJyEnhKEVR1J%2BAnXqLhn7FfJdHaan3NfYNYv27DEEIvZRSWyTrqjH3ny0F%2Bf8aspxE6FbMpN6bi0EegG14ZEMrRHiQ%2Fosan52l1pzPv%2F11o2UwD753e1DVE3H6Upg490A51qtkpFBkVeoX0PBT6h%2FRHdT9TS56cJMSp43R",
                      "size": 109944083,
                      "validityTime": 1200,
                      "needPay": false,
                      "payInfo": null,
                      "r": 720
                  },
                  "videoGroup": [
                      {
                          "id": 58100,
                          "name": "现场",
                          "alg": null
                      },
                      {
                          "id": 1100,
                          "name": "音乐现场",
                          "alg": null
                      },
                      {
                          "id": 5100,
                          "name": "音乐",
                          "alg": null
                      }
                  ],
                  "previewUrl": null,
                  "previewDurationms": 0,
                  "hasRelatedGameAd": false,
                  "markTypes": null,
                  "relateSong": [],
                  "relatedInfo": null,
                  "videoUserLiveInfo": null,
                  "vid": "AA48F6255D6C77DB007EEEC9C8C330A3",
                  "durationms": 461424,
                  "playTime": 1725647,
                  "praisedCount": 22106,
                  "praised": false,
                  "subscribed": false
              }
          },
          {
              "type": 1,
              "displayed": false,
              "alg": "onlineHotGroup",
              "extAlg": null,
              "data": {
                  "alg": "onlineHotGroup",
                  "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                  "threadId": "R_VI_62_C4FB41A5E3184BB5315A9C6AD458989C",
                  "coverUrl": "https://p2.music.126.net/GCi-KagDOtnXseQ94z4eFw==/109951164208771168.jpg",
                  "height": 720,
                  "width": 1280,
                  "title": "最后的莫西干人（1分钟版）",
                  "description": "長歌當哭",
                  "commentCount": 14,
                  "shareCount": 14,
                  "resolutions": [
                      {
                          "resolution": 240,
                          "size": 5690661
                      },
                      {
                          "resolution": 480,
                          "size": 10166292
                      },
                      {
                          "resolution": 720,
                          "size": 16602035
                      }
                  ],
                  "creator": {
                      "defaultAvatar": false,
                      "province": 520000,
                      "authStatus": 1,
                      "followed": false,
                      "avatarUrl": "http://p1.music.126.net/nVx9lP3ng-FCnBMFV1sAQA==/109951163298374187.jpg",
                      "accountStatus": 0,
                      "gender": 1,
                      "city": 520100,
                      "birthday": -1546329600000,
                      "userId": 261524326,
                      "userType": 4,
                      "nickname": "独角兽-祥子",
                      "signature": "時間是用來遺忘的/靈魂是用來歌唱的",
                      "description": "",
                      "detailDescription": "",
                      "avatarImgId": 109951163298374190,
                      "backgroundImgId": 109951164059149170,
                      "backgroundUrl": "http://p1.music.126.net/AyHfErLYaeMgqpbOjXKY2A==/109951164059149166.jpg",
                      "authority": 0,
                      "mutual": false,
                      "expertTags": null,
                      "experts": null,
                      "djStatus": 10,
                      "vipType": 0,
                      "remarkName": null,
                      "avatarImgIdStr": "109951163298374187",
                      "backgroundImgIdStr": "109951164059149166"
                  },
                  "urlInfo": {
                      "id": "C4FB41A5E3184BB5315A9C6AD458989C",
                      "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/jqS6JKKr_2587704381_shd.mp4?ts=1620551238&rid=DD937CC654050575FF7A81D6FB872D4F&rl=3&rs=YktjSoOjbDgyuZwXJrzrOybDcYuXBgDM&sign=b374352b7fd5754235f2532a83ef4f1a&ext=ohIcjnk1LeaprHwckflExYWZmr7r%2BdrQd0T4vmTirWGPDEYILwLX9DUHBMJMEtHSK%2B0aPJYtVB2rasjJgpsP03AjZQGJyEnhKEVR1J%2BAnXqLhn7FfJdHaan3NfYNYv27DEEIvZRSWyTrqjH3ny0F%2Bf8aspxE6FbMpN6bi0EegG14ZEMrRHiQ%2Fosan52l1pzPv%2F11o2UwD753e1DVE3H6Upg490A51qtkpFBkVeoX0PBT6h%2FRHdT9TS56cJMSp43R",
                      "size": 16602035,
                      "validityTime": 1200,
                      "needPay": false,
                      "payInfo": null,
                      "r": 720
                  },
                  "videoGroup": [
                      {
                          "id": 58100,
                          "name": "现场",
                          "alg": null
                      },
                      {
                          "id": 1100,
                          "name": "音乐现场",
                          "alg": null
                      },
                      {
                          "id": 5100,
                          "name": "音乐",
                          "alg": null
                      }
                  ],
                  "previewUrl": null,
                  "previewDurationms": 0,
                  "hasRelatedGameAd": false,
                  "markTypes": null,
                  "relateSong": [
                      {
                          "name": "最後的莫西幹人by獨角獸祥子（翻自 陈亚祥）",
                          "id": 1374606919,
                          "pst": 0,
                          "t": 0,
                          "ar": [
                              {
                                  "id": 12039141,
                                  "name": "陈亚祥",
                                  "tns": [],
                                  "alias": []
                              }
                          ],
                          "alia": [],
                          "pop": 35,
                          "st": 0,
                          "rt": "",
                          "fee": 0,
                          "v": 5,
                          "crbt": null,
                          "cf": "",
                          "al": {
                              "id": 80040784,
                              "name": "最后的莫希干人unicorn-indian",
                              "picUrl": "http://p4.music.126.net/rK4-elR7z8zgi5MgKNTXNQ==/109951164178822107.jpg",
                              "tns": [],
                              "pic_str": "109951164178822107",
                              "pic": 109951164178822110
                          },
                          "dt": 316250,
                          "h": {
                              "br": 320000,
                              "fid": 0,
                              "size": 12652713,
                              "vd": -30094
                          },
                          "m": {
                              "br": 192000,
                              "fid": 0,
                              "size": 7591645,
                              "vd": -27510
                          },
                          "l": {
                              "br": 128000,
                              "fid": 0,
                              "size": 5061111,
                              "vd": -25729
                          },
                          "a": null,
                          "cd": "01",
                          "no": 1,
                          "rtUrl": null,
                          "ftype": 0,
                          "rtUrls": [],
                          "djId": 0,
                          "copyright": 0,
                          "s_id": 0,
                          "rtype": 0,
                          "rurl": null,
                          "mst": 9,
                          "cp": 0,
                          "mv": 0,
                          "publishTime": 0,
                          "privilege": {
                              "id": 1374606919,
                              "fee": 0,
                              "payed": 0,
                              "st": 0,
                              "pl": 320000,
                              "dl": 999000,
                              "sp": 7,
                              "cp": 1,
                              "subp": 1,
                              "cs": false,
                              "maxbr": 999000,
                              "fl": 320000,
                              "toast": false,
                              "flag": 128,
                              "preSell": false
                          }
                      }
                  ],
                  "relatedInfo": null,
                  "videoUserLiveInfo": null,
                  "vid": "C4FB41A5E3184BB5315A9C6AD458989C",
                  "durationms": 59391,
                  "playTime": 31124,
                  "praisedCount": 92,
                  "praised": false,
                  "subscribed": false
              }
          },
          {
              "type": 1,
              "displayed": false,
              "alg": "onlineHotGroup",
              "extAlg": null,
              "data": {
                  "alg": "onlineHotGroup",
                  "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                  "threadId": "R_VI_62_7C4471E6CEBECCDE271FAA7E3918D732",
                  "coverUrl": "https://p2.music.126.net/dNhIGsmrK-tiHyduycs2eA==/109951164393483535.jpg",
                  "height": 720,
                  "width": 1168,
                  "title": "吴亦凡 VS姆爷 音乐现场比拼,哪个比较燃!!!!",
                  "description": "没有要黑谁的意思哈,大家不要误会",
                  "commentCount": 26,
                  "shareCount": 5,
                  "resolutions": [
                      {
                          "resolution": 240,
                          "size": 27210062
                      },
                      {
                          "resolution": 480,
                          "size": 45424346
                      },
                      {
                          "resolution": 720,
                          "size": 60851433
                      }
                  ],
                  "creator": {
                      "defaultAvatar": false,
                      "province": 1000000,
                      "authStatus": 0,
                      "followed": false,
                      "avatarUrl": "http://p1.music.126.net/88-3WddqKzigxro23BYRgQ==/109951164069756109.jpg",
                      "accountStatus": 0,
                      "gender": 2,
                      "city": 1010000,
                      "birthday": 809884800000,
                      "userId": 1366090629,
                      "userType": 0,
                      "nickname": "VISIARY",
                      "signature": "1112222",
                      "description": "",
                      "detailDescription": "",
                      "avatarImgId": 109951164069756110,
                      "backgroundImgId": 109951164076576480,
                      "backgroundUrl": "http://p1.music.126.net/LGolL3ZgUnLE2EirO9H_xA==/109951164076576480.jpg",
                      "authority": 0,
                      "mutual": false,
                      "expertTags": null,
                      "experts": null,
                      "djStatus": 0,
                      "vipType": 0,
                      "remarkName": null,
                      "avatarImgIdStr": "109951164069756109",
                      "backgroundImgIdStr": "109951164076576480"
                  },
                  "urlInfo": {
                      "id": "7C4471E6CEBECCDE271FAA7E3918D732",
                      "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/LXhjzeWE_2604447834_shd.mp4?ts=1620551238&rid=DD937CC654050575FF7A81D6FB872D4F&rl=3&rs=tNFnHRlrQvSwAupERogkqpRLsbXKaZSs&sign=025f82a76d73c52b11b7e012b8ed8adc&ext=ohIcjnk1LeaprHwckflExYWZmr7r%2BdrQd0T4vmTirWGPDEYILwLX9DUHBMJMEtHSK%2B0aPJYtVB2rasjJgpsP03AjZQGJyEnhKEVR1J%2BAnXqLhn7FfJdHaan3NfYNYv27DEEIvZRSWyTrqjH3ny0F%2Bf8aspxE6FbMpN6bi0EegG14ZEMrRHiQ%2Fosan52l1pzPv%2F11o2UwD753e1DVE3H6Upg490A51qtkpFBkVeoX0PBT6h%2FRHdT9TS56cJMSp43R",
                      "size": 60851433,
                      "validityTime": 1200,
                      "needPay": false,
                      "payInfo": null,
                      "r": 720
                  },
                  "videoGroup": [
                      {
                          "id": 58100,
                          "name": "现场",
                          "alg": null
                      },
                      {
                          "id": 59101,
                          "name": "华语现场",
                          "alg": null
                      },
                      {
                          "id": 14212,
                          "name": "欧美音乐",
                          "alg": null
                      },
                      {
                          "id": 96106,
                          "name": "吴亦凡",
                          "alg": null
                      },
                      {
                          "id": 15198,
                          "name": "Eminem",
                          "alg": null
                      }
                  ],
                  "previewUrl": null,
                  "previewDurationms": 0,
                  "hasRelatedGameAd": false,
                  "markTypes": null,
                  "relateSong": [],
                  "relatedInfo": null,
                  "videoUserLiveInfo": null,
                  "vid": "7C4471E6CEBECCDE271FAA7E3918D732",
                  "durationms": 221426,
                  "playTime": 10043,
                  "praisedCount": 26,
                  "praised": false,
                  "subscribed": false
              }
          },
          {
              "type": 1,
              "displayed": false,
              "alg": "onlineHotGroup",
              "extAlg": null,
              "data": {
                  "alg": "onlineHotGroup",
                  "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                  "threadId": "R_VI_62_EB83F3F3E6074D04CF3897870B2103B0",
                  "coverUrl": "https://p1.music.126.net/YyAfT9BOCr7sfqneXOw9Uw==/109951163574071514.jpg",
                  "height": 720,
                  "width": 1280,
                  "title": "TFBOYS - 大梦想家（广州演唱会）",
                  "description": "插上竹蜻蜓张开了翅膀\n飞到任何想要去的地方\n",
                  "commentCount": 72,
                  "shareCount": 195,
                  "resolutions": [
                      {
                          "resolution": 240,
                          "size": 35544802
                      },
                      {
                          "resolution": 480,
                          "size": 59132689
                      },
                      {
                          "resolution": 720,
                          "size": 80924702
                      }
                  ],
                  "creator": {
                      "defaultAvatar": false,
                      "province": 110000,
                      "authStatus": 0,
                      "followed": false,
                      "avatarUrl": "http://p1.music.126.net/5rK5EE48oekIjNHyR3GIYg==/109951163424583352.jpg",
                      "accountStatus": 0,
                      "gender": 0,
                      "city": 110101,
                      "birthday": -2209017600000,
                      "userId": 1345020800,
                      "userType": 0,
                      "nickname": "拾號播放器",
                      "signature": "让我们一起泡在音乐水里面",
                      "description": "",
                      "detailDescription": "",
                      "avatarImgId": 109951163424583360,
                      "backgroundImgId": 109951162868128400,
                      "backgroundUrl": "http://p1.music.126.net/2zSNIqTcpHL2jIvU6hG0EA==/109951162868128395.jpg",
                      "authority": 0,
                      "mutual": false,
                      "expertTags": null,
                      "experts": {
                          "1": "音乐视频达人"
                      },
                      "djStatus": 0,
                      "vipType": 0,
                      "remarkName": null,
                      "avatarImgIdStr": "109951163424583352",
                      "backgroundImgIdStr": "109951162868128395"
                  },
                  "urlInfo": {
                      "id": "EB83F3F3E6074D04CF3897870B2103B0",
                      "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/KIk2AAOz_1829909314_shd.mp4?ts=1620551238&rid=DD937CC654050575FF7A81D6FB872D4F&rl=3&rs=UVxiQcDSgIgRezWFtuEohWsWWnQaJbUO&sign=b2952af40d7fca1fc0aaab76b958f7f4&ext=ohIcjnk1LeaprHwckflExYWZmr7r%2BdrQd0T4vmTirWGPDEYILwLX9DUHBMJMEtHSK%2B0aPJYtVB2rasjJgpsP03AjZQGJyEnhKEVR1J%2BAnXqLhn7FfJdHaan3NfYNYv27DEEIvZRSWyTrqjH3ny0F%2Bf8aspxE6FbMpN6bi0EegG14ZEMrRHiQ%2Fosan52l1pzPv%2F11o2UwD753e1DVE3H6Upg490A51qtkpFBkVeoX0PBT6h%2FRHdT9TS56cJMSp43R",
                      "size": 80924702,
                      "validityTime": 1200,
                      "needPay": false,
                      "payInfo": null,
                      "r": 720
                  },
                  "videoGroup": [
                      {
                          "id": 58100,
                          "name": "现场",
                          "alg": null
                      },
                      {
                          "id": 9102,
                          "name": "演唱会",
                          "alg": null
                      },
                      {
                          "id": 59101,
                          "name": "华语现场",
                          "alg": null
                      },
                      {
                          "id": 57108,
                          "name": "流行现场",
                          "alg": null
                      },
                      {
                          "id": 11137,
                          "name": "TFBOYS",
                          "alg": null
                      },
                      {
                          "id": 1100,
                          "name": "音乐现场",
                          "alg": null
                      },
                      {
                          "id": 5100,
                          "name": "音乐",
                          "alg": null
                      }
                  ],
                  "previewUrl": null,
                  "previewDurationms": 0,
                  "hasRelatedGameAd": false,
                  "markTypes": null,
                  "relateSong": [],
                  "relatedInfo": null,
                  "videoUserLiveInfo": null,
                  "vid": "EB83F3F3E6074D04CF3897870B2103B0",
                  "durationms": 236245,
                  "playTime": 199606,
                  "praisedCount": 1196,
                  "praised": false,
                  "subscribed": false
              }
          }
      ]
    let videoList = this.data.videoList
    videoList.push(...newVideoList)
    this.setData({
      videoList
    })
  },
//   跳转至搜索界面
  toSearch() {
    wx.navigateTo({
        url:"/pages/search/search"
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
  onShareAppMessage: function ({from}) { // 将from解构赋值，可直接用里面的值
    console.log(from); // 值为button和menu
    if(from === 'button'){
      return {
        title: '来自button的转发',
        page: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    }else{
      return {
        title: '来自menu的转发',
        page: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    }
  }
})