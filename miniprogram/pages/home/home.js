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
    currentIndex : 0,
    showComments : true
  },
  watchtab(e){
    let _this = this
    console.log(_this.data.showComments);
    
    this.setData({
      currentIndex : e.currentTarget.dataset.index,
      showComments : !_this.data.showComments
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getWYYData('/comment/hot?id=186016&type=0')
    .then(res=>{
      console.log(res);
      let hotComs = res.data.hotComments

      let storys = []
      hotComs.forEach(v=>{
        let story = {}
        story.name = v.user.nickname;
        story.img = v.user.avatarUrl;
        story.content = v.content;
        let ti = new Date(v.time)
        story.time = ti.toLocaleString();
        storys.push(story)
      })
      this.setData({
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