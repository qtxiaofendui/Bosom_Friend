// miniprogram/pages/detail/detail.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disAble: false,
    EditContent: '',
    resetContent: '',
    detailComs: [],
    goCommentId: '',
    limitShowCommentsNum: 10,
    showCommentsCount: 0,
    hasMoreDetail: true,
    lastCommentId: 0,
    timer: null
  },

  InsetCommentsToCloud(data) {
    return app.insetDataForDb('comments', {
      data
    })
  },
  getCommentsFromCloud(showCommentsCount) {
    let limit = this.data.limitShowCommentsNum,
      skipCount = parseInt(limit) * parseInt(showCommentsCount),
      data = {
        parentCommentId: this.data.detailInfo.id
      }
    return app.getDataFromDb('comments', data, skipCount, limit)
  },
  getLastCommentId() {
    app.getLastItemFromDb('comments', 'commentId', 'desc', 1)
      .then(res => {
        this.setData({
          lastCommentId: res.data[0].commentId
        })
      })
  },
  editComment(e) {
    let commentValue = e.detail.value,
      disAble = commentValue ? true : false;
    this.setData({
      disAble: disAble,
      EditContent: e.detail.value
    })
  },
  sendComment(e) {
    this.getNewComment().then(res => {
        let newComment = res
        this.InsetCommentsToCloud(newComment)
        this.setData({
          resetContent: ''
        })
        let detailComs = this.data.detailComs
        detailComs.push(newComment)
        this.setData({
          detailComs: detailComs
        })
        return res.commentId
      })
      .then(res => {
        this.setData({
          goCommentId: 'wx_' + res
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  getNewComment() {
    return this.getStorage('user').then(res => {
      console.log(res);
      let lastId = ++this.data.lastCommentId
      this.setData({
        lastCommentId: lastId
      })
      let newComment = {}
      newComment.parentCommentId = this.data.detailInfo.id
      newComment.commentId = lastId
      newComment.content = this.data.EditContent
      newComment.time = new Date().toLocaleString()
      newComment.zanimg = '/images/zan/zan_dark.png'
      newComment.hasActive = false
      newComment.name = res.data.name
      newComment.count = 0
      newComment.img = res.data.img
      return newComment
    })
  },
  changeParentLiked() {
    let dataInfo = this.data.detailInfo,
      count = dataInfo.count,
      hasActive = dataInfo.hasActive,
      imgUrl = '';
    if (hasActive) {
      count--;
      imgUrl = '/images/zan/zan_dark.png';
    } else {
      count++;
      imgUrl = '/images/zan/zan_fullred.png'
    }
    this.setCurrPageData('detailInfo', count, imgUrl, !hasActive)
    this.setHomePageData(count, imgUrl, !hasActive)
    this.debounce(this.likeChanged, 500)(dataInfo)
  },
  setCurrPageData(item, count, imgUrl, hasActive) {
    let detailInfo_count = `${item}.count`,
      detailInfo_zanimg = `${item}.zanimg`,
      detailInfo_hasActive = `${item}.hasActive`;
    this.setData({
      [detailInfo_count]: count,
      [detailInfo_zanimg]: imgUrl,
      [detailInfo_hasActive]: hasActive,
    })
  },
  setHomePageData(count, imgUrl, hasActive) {
    let pages = getCurrentPages(),
      prePage = pages[0],
      index = this.data.detailInfo.parentIndex,
      story_count = `storys[${index}].count`,
      story_zanimg = `storys[${index}].zanimg`,
      story_hasActive = `storys[${index}].hasActive`;
    prePage.setData({
      [story_count]: count,
      [story_zanimg]: imgUrl,
      [story_hasActive]: hasActive,
    })
  },
  likeChanged(item) { //获取喜欢的评论
    // console.log(item);
    console.log(1);

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
  likeDetailChange(e) {
    let detailComs = this.data.detailComs,
        index = e.currentTarget.dataset.index,
        dataInfo = detailComs[index],
        count = dataInfo.count,
        hasActive = !dataInfo.hasActive,
        imgUrl = '';
    if (hasActive) {
      count++;
      imgUrl = '/images/zan/zan_fullred.png'
    } else {
      count--;
      imgUrl = '/images/zan/zan_dark.png';
    }
    this.setCurrPageData(`detailComs[${index}]`, count, imgUrl, hasActive)
    this.debounce(this.updataDetailCom, 500)(dataInfo._id,{count,zanimg:imgUrl,hasActive})
  },
  updataDetailCom(id,data){
    app.updataItemFromDb('comments',id,{data})
  },
  debounce(fn, delay) {
    return function (...args) {
      let timer = this.data.timer
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, delay)
      this.setData({
        timer: timer
      })
    }.bind(this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStorage('currentDetail').then(res => {
        let detailComs = Array.from({
          length: 10
        }, v => {
          return res.data
        })
        this.setData({
          detailInfo: res.data
        })
      })
      .then(() => {
        this.getLastCommentId()
        return this.getCommentsFromCloud(0)
      })
      .then(res => {
        this.setData({
          detailComs: res.data
        })
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
        complete: () => {}
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
  scrollToBottom() {
    console.log('到底了');
    wx.showLoading({
      title: '正在加载数据'
    });
    let scc = ++this.data.showCommentsCount
    this.getCommentsFromCloud(scc)
      .then(res => {
        if (res.data.length) {
          let detailComs = this.data.detailComs
          detailComs = detailComs.concat(res.data)
          this.setData({
            detailComs: detailComs,
            hasMoreDetail: true,
            showCommentsCount: scc
          })
        } else {
          this.setData({
            hasMoreDetail: false,
            showCommentsCount: --scc
          })
        }
      }).then(() => {
        wx.hideLoading();
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})