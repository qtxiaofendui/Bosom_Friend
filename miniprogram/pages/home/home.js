// pages/home/home.js
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
    danghangs: ['故事','评论'],
    currentIndex: 1,
    currentSongArrIndex: -1,
    showComments: false,
    hasMore: true,
    hotComms: [],
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
    let index = e.currentTarget.dataset.index,
      item = this.data.hotComms[index],
      hotCom_count = `hotComms[${index}].count`,
      hotCom_zanimg = `hotComms[${index}].zanimg`,
      hotCom_hasActive = `hotComms[${index}].hasActive`,
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
      [hotCom_count]: count,
      [hotCom_zanimg]: imgUrl,
      [hotCom_hasActive]: !hasActive,
    })
    item.hasActive = !hasActive
    this.likeChanged(item)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.initData()
  },

  getSongArr() {
    return new Promise((resolve, reject) => {
      app.getWYYData({
          url: `/recommend/songs`
        })
        .then(res => {
          console.log(res);
          return resolve(res)
        })
    })
  },
  initData() {
    this.getSongArr().then(res => {
        this.setData({
          songIdArr: res.data.recommend
        })
      }).then(() => {
        this.showMoreData()
      })
    this.getItems()
  },
  showMoreData() {
    wx.showLoading({
      title: '加载数据中',
      mask: true,
    });
    
    this.getShowComms()
    .then(res => {
      wx.hideLoading();
      if(!res){
        wx.showToast({
          title: '没有更多数据了',
          duration: 1500
        })
      }else{
        this.setData({
          hotComms: res
        })
      }
    })
  },
  getShowComms(){
    let songId = this.getCurrSongIndex()
    if(!songId){
      return;
    }
    return this.getCommsById(songId)
  },
  getCurrSongIndex(){
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
  getCommsById(songId){
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
      hotCom.artistsName = songInfo.artists.map(v=>{
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
      hotComms.push(hotCom)
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
    this.showMoreData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toDetailPage(e){
    console.log(e);
    let index = e.currentTarget.dataset.index,
        dataInfo = this.data.hotComms[index];
    dataInfo.parentIndex = index;
    console.log(dataInfo);
    this.setStorage('currentDetail',dataInfo)
    .then(()=>{
      wx.navigateTo({
        url: '/pages/detail/detail?goCommentId=2'
      });
    })
  },
  setStorage(key, value) {
    return new Promise((resolve,reject)=>{
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
})