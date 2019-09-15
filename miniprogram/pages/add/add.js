//index.js
const app = getApp()
// const db = wx.cloud.database();
// const productsCollection =
//   db.collection('products');
const db = wx.cloud.database();  //数据库连上了
const productsCollection = db.collection('story');//表， 集合
const bg_img = db.collection('bg_img');//表， 集合

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
    console.log(e.detail.value);
    this.setData({
      title: e.detail.value
    })
  },
  input_content(e) {
    console.log(e.detail.value);
    this.setData({
      content: e.detail.value
    })
  },
  submit(e) {
    let story_Title = this.data.title;
    let story_Content = this.data.content;
    let story_Date = new Date();
    let bg_img = e.target.dataset.bg_img_url;
    console.log(e.target.dataset.bg_img_url);
    let user_Name = '';
    let user_Portrait = '';
    let like_Account = 0;
    let conmmeted_Account = 0;
    let new_comments = {};
    //构造数据库字段

    //获取当前用户数据
    this.getStorage('user').then(res => {
      user_Name = res.data.name;
      user_Portrait = res.data.img;
      console.log('赋值完成')
    }).then(() => {
      //异步执行问题
      const story = {
        story_Title: story_Title,
        story_Content: story_Content,
        story_Date: story_Date,
        bg_img: bg_img,
        like_Account: like_Account,
        conmmeted_Account: conmmeted_Account,
        user_Name: user_Name,
        user_Portrait: user_Portrait,
        new_comments: new_comments
      }
      productsCollection.add({
        data: story
      }).then(res => {
        console.log(res);
      })
      //跳转到详情页
      this.toDetailPage(story);
    })
  },
  getThis() {
    return 123;
  },
  onLoad() {
    productsCollection.get().then(res => {
      console.log(res.data);

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
  onShow() {
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
  }
})