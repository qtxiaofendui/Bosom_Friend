// pages/home/home.js
const regeneratorRuntime = require("../../utils/runtime");
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://p1.music.126.net/TuuwV-oVNsksERMb1aZtpA==/109951164315584682.jpg',
      'http://p1.music.126.net/lx2H-24UBk1hI55bQIpFdA==/109951164315873437.jpg',
      'http://p1.music.126.net/Iy9L9pDvSehZw2xIYxhkdw==/109951164314157448.jpg'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    danghangs: ['故事', '评论'],
    currentIndex: 1,
    currentSongArrIndex: -1,
    currentStoryPage: 0,
    showComments: false,
    hasMore: true,
    hasMoreStroys: true,
    limitDataLen: 10,
    hotComms: [],
    storys: [],
    songIdArr: []
  },
  watchtab(e) {
    let _this = this
    // console.log(_this.data.showComments);

    this.setData({
      currentIndex: e.currentTarget.dataset.index,
      showComments: !_this.data.showComments
    })
  },
  addCount(e) {
    let typeStr = '',
        index = e.currentTarget.dataset.index,
        item = {}
    if (this.data.currentIndex === 1) {
      typeStr = 'hotComms'
      item = this.data.hotComms[index]
    } else {
      typeStr = 'storys'
      item = this.data.storys[index]
    }
    let item_count = `${typeStr}[${index}].count`,
        item_zanimg = `${typeStr}[${index}].zanimg`,
        item_hasActive = `${typeStr}[${index}].hasActive`,
        count = item.count,
        hasActive = item.hasActive,
        imgUrl = '/images/zan/zan_fullred.png';
    if (hasActive) {
      count--;
      imgUrl = '/images/zan/zan_dark.png';
    } else {
      count++;
      imgUrl = '/images/zan/zan_fullred.png'
    }
    this.setData({
      [item_count]: count,
      [item_zanimg]: imgUrl,
      [item_hasActive]: !hasActive,
    })
    item.hasActive = !hasActive
    console.log(item)
    if (this.data.currentIndex === 1) {
      this.commentLikedChanged(item)
    } else {
      this.storyLikedChange(item)
    }
  },
  async storyLikedChange(item) {
    console.log(item.id, item.count);
    this.updataStory(item.id, {
      like_Account: item.count
    }).then(console.log)
    let userData = await this.getStorage('user'),
      user = userData.data
    if(item.hasActive){
      this.insetLikedItem({
        storyId: item.id,
        userId: user.id
      })
    }else{
      let data = await this.getLikedTableItem({
        storyId: item.id,
        userId: user.id
      })
      this.removeLikedItem(data.data[0]._id)
    }
  },
  removeLikedItem(id){
    return wx.cloud.callFunction({
      name: 'dboper',
      data:{
        dbFunc:'removeItemFromDb',
        collection: 'likedTable',
        id
      }
    })
  },
  async getLikedTableItem(data){
    let result = await wx.cloud.callFunction({
      name: 'dboper',
      data:{
        dbFunc:'getDataFromDb',
        collection: 'likedTable',
        data,
        skipCount:0,
        limit:1
      }
    })
    return result.result.data
  },
  insetLikedItem(data) {
    return wx.cloud.callFunction({
      name: 'dboper',
      data:{
        dbFunc:'insetDataForDb',
        collection: 'likedTable',
        data: {data}
      }
    })
  },
  updataStory(id, data) {
    return wx.cloud.callFunction({
      name: 'dboper',
      data:{
        dbFunc:'updataItemFromDb',
        collection: 'story',
        id,
        data:{data},
      }
    })
  },
  commentLikedChanged(item){
    this.likeChanged(item)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.initData()
    this.setStorys()
  },

  getSongArr() {
    return app.getWYYData({
      url: `/recommend/songs`
    })
  },
  initData() {
    this.getSongArr().then(res => {
      this.setData({
        songIdArr: res.data.recommend
      })
    }).then(res => {
      this.showMoreData()
    })
    this.getItems()
  },
  showMoreData() {
    wx.showLoading({
      title: '加载数据中'
    });
    this.getLimitData()
      .then(res => {
        this.setData({
          hotComms: res
        })
      }).finally(() => {
        wx.hideLoading();
      })
  },
  async getLimitData() {
    let result = []
    while (result.length < this.data.limitDataLen) {
      let newData = await this.getShowComms()
      result = result.concat(newData)
    }
    return result
  },
  getShowComms() {
    let songId = this.getCurrSongIndex()
    if (!songId) {
      return;
    }
    return this.getCommsById(songId)
  },
  getCurrSongIndex() {
    let currentSongArrIndex = ++this.data.currentSongArrIndex
    if (currentSongArrIndex >= this.data.songIdArr.length) {
      this.setData({
        hasMore: false
      })
      return;
    }
    this.setData({
      currentSongArrIndex: currentSongArrIndex
    })
    return this.data.songIdArr[currentSongArrIndex].id
  },
  getCommsById(songId) {
    return app.getWYYData({
        url: `/comment/hot?id=${songId}&type=0`
      })
      .then(res => {
        let currentSongArrIndex = this.data.currentSongArrIndex,
          songinfo = this.data.songIdArr[currentSongArrIndex],
          hotComs = res.data.hotComments,
          newHothotComms = []
        this.gethotComms(songinfo, hotComs, newHothotComms)
        let newhotComms = this.data.hotComms.concat(newHothotComms);
        return newhotComms
      })
  },
  getItems() {
    let item_len = this.data.danghangs.length;
    let item_p = parseInt(100 / item_len)
    this.setData({
      item_p: item_p
    })
  },
  gethotComms(songInfo, hots, hotComms) {
    hots.forEach(v => {
      let hotCom = {}
      hotCom.songId = songInfo.id
      hotCom.songName = songInfo.name
      hotCom.artistsName = songInfo.artists.map(v => {
        return v.name
      })
      hotCom.id = v.commentId
      hotCom.name = v.user.nickname;
      hotCom.img = v.user.avatarUrl;
      hotCom.content = v.content;
      let ti = new Date(v.time)
      hotCom.time = ti.toLocaleString();
      hotCom.count = v.likedCount
      hotCom.hasActive = v.liked
      hotCom.zanimg = v.liked ? '/images/zan/zan_fullred.png' : '/images/zan/zan_dark.png'
      hotCom.oldActive = v.liked
      hotCom.typeStr = 'hotComms'
      hotComms.push(hotCom)
    })
  },
  getLikedItem(data){
    return wx.cloud.callFunction({
      name: 'dboper',
      data:{
        dbFunc:'getDataFromDb',
        collection: 'likedTable',
        data,
        skipCount: 0,
        limit: 1
      }
    })
  },
  getCloudStroys(tagName,order,skipCount){
    return wx.cloud.callFunction({
      name: 'dboper',
      data:{
        dbFunc:'getLastItemFromDb',
        collection: 'story',
        tagName,
        order,
        skipCount,
        limit: this.data.limitDataLen
      }
    })
  },
  async getLimitStorys () {
    let storyPage = this.data.currentStoryPage
    let storySkip = storyPage * this.data.limitDataLen
    let result = await this.getCloudStroys('like_Acount','desc',storySkip);
    let storys = result.result.data.data;
    console.log(result);
    
    if (storys.length < this.data.limitDataLen) {
      this.setData({
        hasMoreStroys: false
      })
    } else {
      this.setData({
        currentStoryPage: ++storyPage
      })
    }
    return storys
  },
  async setStorys(){
    if(!this.data.hasMoreStroys){
      return
    }
    let storys = await this.getLimitStorys()
    let user = await this.getStorage('user')
    
    for(let i = 0; i < storys.length; i++){
      let isliked = await this.getLikedItem({
        storyId: storys[i]._id,
        userId: user.data.id
      })
      // console.log(isliked.result);
      storys[i].liked = isliked.result.data.data.length > 0
    }
    console.log(storys);
    
    let newStorys = []
    this.getStorys(storys, newStorys)
    newStorys = this.data.storys.concat(newStorys)
    this.setData({
      storys: newStorys
    })
  },
  getStorys(storys, newStorys) {
    storys.forEach(v => {
      let story = {}
      story.id = v._id
      story.songName = v.story_Title
      story.name = v.user_Name;
      story.img = v.user_Portrait;
      story.content = v.story_Content;
      // let ti = new Date(v.story_Date)
      story.time = v.story_Date
      story.count = v.like_Account
      story.hasActive = v.liked || false
      story.zanimg = v.liked ? '/images/zan/zan_fullred.png' : '/images/zan/zan_dark.png'
      story.oldActive = v.liked || false
      story.typeStr = 'storys'
      newStorys.push(story)
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

  likeChanged(item) { //获取喜欢的评论
    // console.log(item);
    let t = 1
    if (!item.hasActive) {
      t = 0
    }
    // console.log(item.hasActive,t);

    app.getWYYData({
        url: `/comment/like?id=${item.songId}&cid=${item.id}&t=${t}&type=0`
      })
      .then(res => {
        // console.log(res);

      })
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
    console.log('到底了');
    if(this.data.currentIndex === 1){
      this.showMoreData()
    }else{
      this.setStorys()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toDetailPage(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let dataInfo;
    if(this.data.currentIndex === 1){
      dataInfo = this.data.hotComms[index];
    } else {
      dataInfo = this.data.storys[index];
    }
    dataInfo.parentIndex = index;
    console.log(dataInfo);
    this.setStorage('currentDetail', dataInfo)
      .then(() => {
        wx.navigateTo({
          url: '/pages/detail/detail?goCommentId=2'
        });
      })
  },
  setStorage(key, value) {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key: key,
        data: value,
        success: (result) => {
          return resolve(result)
        },
        fail: (err) => {
          return reject(err)
        },
        complete: () => {}
      });
    })
  },
  getStorage(key) {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: key,
        success: (result) => {
          return resolve(result)
        },
        fail: (err) => {
          return reject(err)
        },
        complete: () => {}
      });
    })
  }
})