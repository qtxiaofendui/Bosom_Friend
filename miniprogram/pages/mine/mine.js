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
    limit: 4,
    dynamic: [
      // {
      //   story_Title: 'Finish Home Screen',
      //   date: '2019-09-08',
      //   like_Account: '80',
      //   active: false,
      //   new_comments: []
      // },
      // {
      //   story_Title: '大大怪将军',
      //   date: 'June 17',
      //   like_Account: '1000',
      //   active: false,
      //   new_comments: []
      // },
      // {
      //   story_Title: '大大怪将军',
      //   date: '2019-09-10',
      //   like_Account: '910',
      //   active: false,
      //   new_comments: []
      // },
      // {
      //   story_Title: '大大怪将军',
      //   date: '2019-09-10',
      //   like_Account: '910',
      //   active: true,
      //   new_comments: [{
      //       img: 'http://p1.music.126.net/TuuwV-oVNsksERMb1aZtpA==/109951164315584682.jpg',
      //       userName: 'Adam Lane'
      //     },
      //     {
      //       img: 'http://p1.music.126.net/Iy9L9pDvSehZw2xIYxhkdw==/109951164314157448.jpg',
      //       userName: 'Adam Lane'
      //     },
      //     {
      //       img: 'http://p1.music.126.net/lx2H-24UBk1hI55bQIpFdA==/109951164315873437.jpg',
      //       userName: 'Adam Lane'
      //      }
      //   ]
      // },
      // {
      //   story_Title: '大大怪将军',
      //   date: '2019-09-10',
      //   like_Account: '910',
      //   active: false,
      //   new_comments: ''
      // }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.initEleWidth();
    this.setData({
      slideButtons: [
        {
          text: '删除',
          extClass: 'test',
          src: '../../images/mine_icon/shanchu.png ', // icon的路径
        }],
    });
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
    this.getDynamic(4, 0);
  },
  //更新数组数据
  setDynamicItemData(i, item) {
    let hasNotReadItem = `dynamic[${i}]`
    this.setData({
      [hasNotReadItem]: item
    })
  },
  //获取动态
  getDynamic(limit, skipCount) {
    let dynamic = this.data.dynamic;
    app.getDataFromDb('story', {}, skipCount, limit)
      .then(res => {
        dynamic = res.data;
        this.setData({
          dynamic: this.data.dynamic.concat(res.data)
        })
      })
      //故事与一级评论关联
      .then(() => {
        for (let i = skipCount; i < dynamic.length; i++) {
          comments.where({
            parentCommentId: dynamic[i]._id
          }).limit(3).get()
            .then(res => {
              dynamic[i]['not_read_comments'] = res.data;
              if (res.data.length !== 0) {
                dynamic[i]['active'] = true;
              } else {
                dynamic[i]['active'] = false;
              }
              this.setDynamicItemData(i, dynamic[i])
            });
        };
      })
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

  // 下拉刷新
  onPullDownRefresh: function () { },
  /**
   * 页面上拉触底事件的处理函数
   */
  /**
       * 页面上拉触底事件的处理函数

     */
  onReachBottom: function () {
    wx.showLoading({
      title: '玩命加载中',
    })
    console.log(this.data.limit);
    this.getDynamic(3, this.data.limit);
    this.data.limit += 2;
    setTimeout(() => {
      this.setData({
        limit: this.data.limit
      })
      wx.hideLoading();
    }, 1000)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  slideButtonTap(e) {
    // console.log('slide button tap', e.detail);
    // console.log(e.target.dataset._id);
    console.log(e);
    var num = e.currentTarget.dataset.index;//获取data-index
    this.data.dynamic.splice(num, 1);
    this.setData({
      dynamic: this.data.dynamic
    });
    story.where({
      _id:this.data.dynamic[num]._id
    }).remove();
  },
  toDetailPage(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index,
      dataInfo = this.data.dynamic[index];
    dataInfo.parentIndex = index;
    console.log(dataInfo);
    this.setStorage('currentDetail', dataInfo)
      .then(() => {
        wx.navigateTo({
          url: '/pages/detail/detail'
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
        complete: () => { }
      });
    })
  }
})