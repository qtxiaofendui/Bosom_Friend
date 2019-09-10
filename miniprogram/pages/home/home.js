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
    currentSongId: 0,
    showComments: false,
    hasMore: true
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
      item = this.data.storys[index],
      story_count = `storys[${index}].count`,
      story_zanimg = `storys[${index}].zanimg`,
      story_hasActive = `storys[${index}].hasActive`,
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
      [story_count]: count,
      [story_zanimg]: imgUrl,
      [story_hasActive]: !hasActive,
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
    wx.showLoading({
      title: '加载数据中'
    });
    this.getSongArr().then(res => [
        this.setData({
          songIdArr: res.data.recommend
        })
      ]).then(() => {
        let currentSongId = this.data.currentSongId
        let songId = this.data.songIdArr[currentSongId].id
        return app.getWYYData({
          url: `/comment/hot?id=${songId}&type=0`
        })
      })
      .then(res => {
        console.log(res);
        let currentSongId = this.data.currentSongId,
            songinfo = this.data.songIdArr[currentSongId],
            hotComs = res.data.hotComments,
            storys = []
        this.getStorys(songinfo, hotComs, storys)
        this.setData({
          hotComments: hotComs,
          storys: storys
        })
        wx.hideLoading();
      })
    // .catch(console.log)

    this.getItems()
  },
  getItems() {
    let item_len = this.data.danghangs.length;
    let item_p = parseInt(100 / item_len)
    this.setData({
      item_p: item_p
    })
  },
  getStorys(songInfo, hots, storys) {
    hots.forEach(v => {
      let story = {}
      story.songId = songInfo.id
      story.songName = songInfo.name
      story.artistsName = songInfo.artists.map(v=>{
        return v.name
      })
      story.id = v.commentId
      story.name = v.user.nickname;
      story.img = v.user.avatarUrl;
      story.content = v.content;
      let ti = new Date(v.time)
      story.time = ti.toLocaleString();
      story.count = v.likedCount
      story.hasActive = v.liked
      story.zanimg = v.liked ? '/images/zan/zan_fullred.png' : '/images/zan/zan_dark.png'
      story.oldActive = v.liked
      storys.push(story)
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
  onHide: function () {},
  hotComsChanged() {
    this.data.storys.forEach(v => {
      v.oldActive !== v.hasActive && this.likeChanged(v)
    })
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
    // this.hotComsChanged()
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
    // console.log('到底了');
    this.showMoreData()
  },
  showMoreData() {
    let currentSongId = ++this.data.currentSongId
    if (currentSongId >= this.data.songIdArr.length) {
      this.setData({
        hasMore: false
      })
      return;
    }
    let songId = this.data.songIdArr[currentSongId].id
    wx.showLoading({
      title: '正在获取更多数据',
      mask: true,
    });
    this.setData({
      currentSongId: currentSongId
    })
    app.getWYYData({
        url: `/comment/hot?id=${songId}&type=0`
      })
      .then(res => {
        let currentSongId = this.data.currentSongId,
            songinfo = this.data.songIdArr[currentSongId],
            hotComs = res.data.hotComments,
            newHotStorys = []
        this.getStorys(songinfo, hotComs, newHotStorys)
        let newStorys = this.data.storys.concat(newHotStorys);
        this.setData({
          storys: newStorys
        })
        wx.hideLoading();
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toDetailPage(e){
    console.log(e);
    let index = e.currentTarget.dataset.index,
        dataInfo = this.data.storys[index];
    dataInfo.parentIndex = index;
    console.log(dataInfo);
    this.setStorage('currentDetail',dataInfo)
    .then(()=>{
      wx.navigateTo({
        url: '/pages/detail/detail?goCommentId=29'
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