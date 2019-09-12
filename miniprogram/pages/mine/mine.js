// pages/mine/mine.js
const app = getApp();
const db = wx.cloud.database(); //连接数据库
const story = db.collection('story');
const comments = db.collection('comments');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dynamic: [{
        story_Title: 'Finish Home Screen',
        date: '2019-09-08',
        like_Account: '80',
        active: false,
        new_comments: []
      },
      {
        story_Title: '大大怪将军',
        date: 'June 17',
        like_Account: '1000',
        active: false,
        new_comments: []
      },
      {
        story_Title: '大大怪将军',
        date: '2019-09-10',
        like_Account: '910',
        active: false,
        new_comments: []
      },
      {
        story_Title: '大大怪将军',
        date: '2019-09-10',
        like_Account: '910',
        active: true,
        new_comments: [{
            img: 'http://p1.music.126.net/TuuwV-oVNsksERMb1aZtpA==/109951164315584682.jpg',
            userName: 'Adam Lane'
          },
          {
            img: 'http://p1.music.126.net/Iy9L9pDvSehZw2xIYxhkdw==/109951164314157448.jpg',
            userName: 'Adam Lane'
          },
          {
            img: 'http://p1.music.126.net/lx2H-24UBk1hI55bQIpFdA==/109951164315873437.jpg',
            userName: 'Adam Lane'
          }
        ]
      },
      {
        story_Title: '大大怪将军',
        date: '2019-09-10',
        like_Account: '910',
        active: false,
        new_comments: ''
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(this.data.dynamic)
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
    let dynamic = this.data.dynamic;
    story.get().then(res => {
        // console.log(res.data);
        //dynamic = res.data;
        this.setData({
          dynamic: res.data
        })
      })
      //异步问题，先查询得到故事，查询与故事关联的comments
      .then(
        () => {
          for (let i = 0; i < dynamic.length; i++) {
            comments.where({
                parentCommentId: dynamic[i]._id
              }).get()
              .then(res => {
                //console.log(res.data,i);
                dynamic[i]['not_read_comments'] = res.data;
                dynamic[i]['active'] = true;
                this.setDynamicItemData(i, dynamic[i])
              });
          };
        }
      )
  },
  setDynamicItemData(i,item){
    let hasNotReadItem = `dynamic[${i}]`
    this.setData({
      [hasNotReadItem]: item
    })
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