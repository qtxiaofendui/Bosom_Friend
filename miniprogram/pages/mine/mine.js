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
    this.getStorage('user').then(res => {
      let owner = res.data.owner;
      this.setData({
        owner: owner
      });
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
    this.getData(limit,skipCount)
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
            parentCommentId : dynamic[i]._id,
            has_read : false
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
  getData(limit, skipCount){
    if(skipCount == 0){
      return story.where({ owner: this.data.owner }).limit(limit).get()
    }else{
      return story.where({ owner: this.data.owner }).skip(skipCount).limit(limit).get()
    }
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
  toDetailPage(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index,
      dataInfo = this.data.dynamic[index];
    // 把active状态清除
    comments.where({
      parentCommentId: dataInfo._id,
      has_read: false
    }).get()
    .then((res)=>{
      for(let comment in res){
        comments.doc(comment._id).set({has_read: true});
      }
    })


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
  },
  getStorage(item) {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: item,
        success: (result) => {
          return resolve(result)
        },
        fail: (err) => {
          return reject(err)
        },
        complete: () => { }
      });
    })
  },
})