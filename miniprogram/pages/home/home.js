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
    danghangs:['评论','故事'],
    currentIndex : 1,
    currentSongId : 0,
    showComments : false
  },
  watchtab(e){
    let _this = this
    console.log(_this.data.showComments);
    
    this.setData({
      currentIndex : e.currentTarget.dataset.index,
      showComments : !_this.data.showComments
    })
  },
  addCount(e){
    let index = e.currentTarget.dataset.index,
        story_count = `storys[${index}].count`,
        story_zanimg = `storys[${index}].zanimg`,
        story_hasActive = `storys[${index}].hasActive`,
        count = this.data.storys[index].count,
        hasActive = this.data.storys[index].hasActive,
        imgUrl = '/images/zan/zan_fullred.png';
    if(hasActive){
      count--;
      imgUrl = '/images/zan/zan_dark.png';
    }else{
      count++;
      imgUrl = '/images/zan/zan_fullred.png'
    }
    
    this.setData({
      [story_count] : count,
      [story_zanimg]: imgUrl,
      [story_hasActive] : !hasActive
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData()
    
    
  },

  getSongArr(){
    return new Promise((resolve,reject)=>{
      app.getWYYData(`/personalized/newsong`)
      .then(res=>{
        console.log(res);
        return resolve(res)
      })
    })
  },
  initData(){
    this.getSongArr().then(res=>[
      this.setData({
        songIdArr:res.data.result
      })
    ]).then(()=>{
      let currentSongId = this.data.currentSongId
      let songId = this.data.songIdArr[currentSongId].id
      return app.getWYYData(`/comment/hot?id=${songId}&type=0`)
    })
    .then(res=>{
      let currentSongId = this.data.currentSongId
      let songId = this.data.songIdArr[currentSongId].id
      console.log(res);
      let hotComs = res.data.hotComments
      let storys = []
      this.getStorys(hotComs,storys)
      this.setData({
        songId : songId,
        hotComments : hotComs,
        storys : storys
      })
    })
    .catch(console.log)

    let item_len = this.data.danghangs.length;
    let item_p = parseInt(100 / item_len)
    this.setData({
      item_p : item_p
    })
  },
  getStorys(hots,storys){
    hots.forEach(v=>{
      let story = {}
      story.id = v.commentId
      story.name = v.user.nickname;
      story.img = v.user.avatarUrl;
      story.content = v.content;
      let ti = new Date(v.time)
      story.time = ti.toLocaleString();
      story.zanimg = '/images/zan/zan_dark.png'
      story.count = parseInt(Math.random()*1000)
      story.hasActive = false
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
  onHide: function () {
    
    
  },

  likeComments(){
    let songId = this.data.songId
    this.data.storys.forEach(v=>{
      if(v.hasActive){
        app.getWYYData(`/comment/like?id=${songId}&cid=${v.commentId}&t=1&type=0`)
        .then(res=>{
          console.log(res);
          
        })
      }
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
    wx.showLoading({
      title: '正在获取更多数据',
      mask: true,
    });
    let currentSongId = ++this.data.currentSongId
    this.setData({
      currentSongId : currentSongId
    })
    let songId = this.data.songIdArr[currentSongId].id
    app.getWYYData(`/comment/hot?id=${songId}&type=0`)
    .then(res=>{
      let hotComs = res.data.hotComments
      let newHotStorys = []
      this.getStorys(hotComs,newHotStorys);
      let newStorys = this.data.storys.concat(newHotStorys);
      this.setData({
        storys : newStorys
      })
      wx.hideLoading();
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})