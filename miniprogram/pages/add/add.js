//  index.js
const app = getApp()
const db = wx.cloud.database();  // 数据库连上了
const productsCollection = db.collection('story');// 表， 集合
const bg_img = db.collection('bg_img');// 表， 集合
Page({

  data: {
    imgUrls: [
      '../../images/bg_img/bg_img(1).jpg ',
      '../../images/bg_img/bg_img(2).jpg ',
      '../../images/bg_img/bg_img(3).jpg ',
      '../../images/bg_img/bg_img(4).jpg ',
      '../../images/bg_img/bg_img(5).jpg ',
      '../../images/bg_img/bg_img(6).jpg ',
      '../../images/bg_img/bg_img(7).jpg '
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    products: [],
    covertFlag: 'block',
    title: '',
    content: ''
  },
  input_title(e) {
    this.setData({
      title: e.detail.value
    })
  },
  input_content(e) {
    this.setData({
      content: e.detail.value
    })
  },
  submit(e) {
    let story_Title = this.data.title;
    let story_Content = this.data.content;
    let story_Date = new Date();
    let bg_img = e.target.dataset.bg_img_url;
    let user_Name = '';
    let user_Img = '';
    let owner = '';
    let user_Portrait = '';
    let like_Account = 0;
    let conmmeted_Account = 0;
    //获取当前用户数据
    this.getStorage('user').then(res => {
      user_Name = res.data.name;
      user_Img = res.data.img;
      user_Portrait = res.data.img;
      owner = res.data.owner;
      console.log('赋值完成')
    }).then(() => {
      //构造数据库字段
      const story = {
        story_Title: story_Title,
        story_Content: story_Content,
        story_Date: story_Date.toUTCString(),
        bg_img: bg_img,
        like_Account: like_Account,
        conmmeted_Account: conmmeted_Account,
        user_Name: user_Name,
        user_Img: user_Img,
        user_Portrait: user_Portrait,
        owner: owner
      }
      // 计算出id
      let id = 0; 
      productsCollection.count().then((res) => {
        id = res.total;
      }).then(() => {
        // 数据存入数据库中
        story['id'] = id;
        this.InsetCommentsToCloud(story).then(() => {
          // 获取到story的_id
          this.getData(id).then((res) => {
            let _id = res.result.data.data[0]._id;
            console.log(_id);
            // 变量名一致化
            let dataInfo = {};
            this.assignment(dataInfo, story);
            dataInfo.parentIndex = _id;
            dataInfo.id = _id;
            // 跳转到详情页
            this.toDetailPage(dataInfo);
          });
          
        })
      })
    })
  },
  onLoad() {
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
  onShow() {
    this.clearInputEvent();
    var date = new Date().toUTCString()/*.substring(0, 16)*/;
    this.setData({
      time: date
    })
  },
  toDetailPage(e) {
    console.log(e);
    let dataInfo = e;
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
  // 插入数据库
  InsetCommentsToCloud(data) {
    return wx.cloud.callFunction({
      name: 'dboper',
      data: {
        dbFunc: 'insetDataForDb',
        collection: 'story',
        data: { data }
      }
    })
  },
  // 变量名重构
  assignment(dataInfo, dataSourse) {
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
  // 清空输入框
  clearInputEvent: function (res) {
    this.setData({
      'inputContent': '',
      'inputTitle':''
    })
  },
  // get数据
  getData(id) {
    return wx.cloud.callFunction({
      name: 'dboper',
      data: {
        dbFunc: 'getDataFromDb',
        collection: 'story',
        data: {id:id},
        skipCount: 0,
        limit: 1
      }
    })
    // .then((res) => {
    //   let result = res.result.data.data[0];
    //   return result._id;
    //   console.log(result._id);
    // })
  },
})