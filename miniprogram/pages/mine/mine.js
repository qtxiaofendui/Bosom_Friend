// pages/mine/mine.js
const db = wx.cloud.database(); //连接数据库
const story = db.collection('story');
const comments = db.collection('comments');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dynamic: [{
        title: 'Finish Home Screen',
        date: '2019-09-08',
        like_Account: '80',
        active: false,
        users: ''
      },
      {
        title: '大大怪将军',
        date: 'June 17',
        like_Account: '1000',
        active: false,
        users: ''
      },
      {
        title: '大大怪将军',
        date: '2019-09-10',
        like_Account: '910',
        active: false,
        users: ''
      },
      {
        title: '大大怪将军',
        date: '2019-09-10',
        like_Account: '910',
        active: true,
        users: [{
            thumbUrl: 'http://p1.music.126.net/TuuwV-oVNsksERMb1aZtpA==/109951164315584682.jpg',
            userName: 'Adam Lane'
          },
          {
            thumbUrl: 'http://p1.music.126.net/Iy9L9pDvSehZw2xIYxhkdw==/109951164314157448.jpg',
            userName: 'Adam Lane'
          },
          {
            thumbUrl: 'http://p1.music.126.net/lx2H-24UBk1hI55bQIpFdA==/109951164315873437.jpg',
            userName: 'Adam Lane'
          }
        ]
      },
      {
        title: '大大怪将军',
        date: '2019-09-10',
        like_Account: '910',
        active: false,
        users: ''
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    story.where({
      _id:"5d262bd45d727f18135ea51e019c8153"
    }).get().then(res => {
      // console.log(res.data);
      this.setData({
        dynamic: res.data
      })
    });

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})