// pages/mine/mine.js
const regeneratorRuntime = require("../../utils/runtime");
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
    dynamic: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      console.log('++++', owner);
      this.setData({
        owner: owner
      });
    });
    this.getDynamic(4, 0);
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
  //更新数组数据
  setDynamicItemData(i, item) {
    let hasNotReadItem = `dynamic[${i}]`
    this.setData({
      [hasNotReadItem]: item
    })
  },
  //获取动态
  async getDynamic(limit, skipCount) {
    let user =  await this.getStorage('user')
    let owner = user.data.owner;
    this.setData({
      user:user
    })
    let dynamic = this.data.dynamic;
    console.log('------', this.data.owner) 
    this.getData('story', { owner: this.data.owner }, limit, skipCount)
      .then(res => {
        dynamic = res.result.data.data;
        console.log('故事列表：', res);
        this.setData({
          dynamic: this.data.dynamic.concat(dynamic)
        })
      })
      //故事与评论关联
      .then(() => {
        let dynamic = this.data.dynamic;
        for (let i = skipCount; i < dynamic.length; i++) {
          this.getData('comments', { parentCommentId: dynamic[i]._id, has_read: false }, 10, 0)
            .then(res => {
              console.log('评论列表',res.result.data.data)
              dynamic[i]['not_read_comments'] = res.result.data.data;
              if (res.result.data.data.length !== 0) {
                dynamic[i]['active'] = true;
              } else {
                dynamic[i]['active'] = false;
              }
              this.setDynamicItemData(i, dynamic[i])
            });
        };
      })
  },
  getData(col, data, limit, skipCount) {
    return wx.cloud.callFunction({
      name: 'dboper',
      data: {
        dbFunc: 'getDataFromDb',
        collection: col,
        data: data,
        skipCount: skipCount,
        limit: limit
      }
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
    this.data.limit += 3;
    this.setData({
      limit: this.data.limit
    })
    wx.hideLoading();
  },
  // 去到详情页
  async toDetailPage(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index,
      dataSourse = this.data.dynamic[index];
    let dataInfo = {};
    this.assignment(dataInfo, dataSourse);
    // 把active状态清除
    this.data.dynamic[index].active = false;
    this.setData({
      dynamic : this.data.dynamic
    });
    this.remove_active(dataSourse);
    dataInfo.parentIndex = index;
    console.log(dataInfo);
    let isliked = await this.getLikedItem({
      storyId: dataSourse._id,//story_id
      userId: this.data.user.id // owner_id
    })
    console.log('----+++++', isliked);
    dataInfo.liked = isliked.result.data.data.length > 0
    
    this.setStorage('currentDetail', dataInfo)
      .then(() => {
        wx.navigateTo({
          url: '/pages/detail/detail'///pages/detail/detail&commentId=1
        });
      })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  // 重构变量名
  assignment(dataInfo, dataSourse) {
    dataInfo.id = dataSourse._id;
    dataInfo.songName = dataSourse.story_Title
    dataInfo.name = dataSourse.user_Name
    dataInfo.img = dataSourse.user_Img
    dataInfo.content = dataSourse.story_Content;
    dataInfo.time = dataSourse.story_Date;
    dataInfo.count = dataSourse.like_Account;
    dataInfo.hasActive = false;
    dataInfo.zanimg = '/images/zan/zan_dark.png'
    dataInfo.oldActive = false;
    dataInfo.typeStr = 'storys';
    dataInfo.isFromMine = true;
  },
  // 把数据保存到storage中
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
  // 从storage中获取数据
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
  // 把active状态清除
  remove_active(data) {
    console.log('-----',data);
    for(let i = 0; i < data.not_read_comments.length; i++){
      let dataSource = data.not_read_comments[i];
      this.updataComments(dataSource._id,{ has_read:true });
    }
  },
  updataComments(id, data) {
    return wx.cloud.callFunction({
      name: 'dboper',
      data: {
        dbFunc: 'updataItemFromDb',
        collection: 'comments',
        id,
        data: { data },
      }
    })
  },
  getLikedItem(data) {
    return wx.cloud.callFunction({
      name: 'dboper',
      data: {
        dbFunc: 'getDataFromDb',
        collection: 'likedTable',
        data,
        skipCount: 0,
        limit: 1
      }
    })
  },
})