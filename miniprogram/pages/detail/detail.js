// miniprogram/pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disAble : false,
    newComment : ''
  },
  editComment(e){
    let commentValue = e.detail.value,
        disAble = commentValue ? true : false;
    this.setData({
      disAble:disAble,
      newComment : e.detail.value
    })
  },
  sendComment(e){
    let newComment = this.getNewComment()
    this.setData({
      newComment : ''
    })
    let detailComs = this.data.detailComs
    detailComs.push(newComment)
    this.setData({
      detailComs:detailComs
    })
  },
  getNewComment(){
    let newComment = {}
    newComment.content = this.data.newComment
    newComment.time = new Date().toLocaleString()
    newComment.zanimg = '/images/zan/zan_fullred.png'
    newComment.name = '才有所改观'
    newComment.count = 0
    newComment.img = 'https://p3.music.126.net/B1KyQ4omJf6bqU0LXlMySQ==/6668538022921486.jpg'
    return newComment
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStorage('currentDetail').then(res=>{
      console.log(res);
      let detailComs = Array.from({length:10},v=>{
        return res.data
      })
      this.setData({
        detailInfo : res.data,
        detailComs : detailComs
      })
    })
  },

  getStorage(item){
    return new Promise((resolve,reject)=>{
      wx.getStorage({
        key: item,
        success: (result)=>{
          return resolve(result)
        },
        fail: (err)=>{
          return reject(err)
        },
        complete: ()=>{}
      });
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