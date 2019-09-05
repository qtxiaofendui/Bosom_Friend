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
    covertFlag : 'block',
    title:'',
    content:''
  },
  input_title(e){
    console.log(e.detail.value);
    this.setData({
      title:e.detail.value
    })
  },
  input_content(e){
    console.log(e.detail.value);
    this.setData({
      content: e.detail.value
    })
  },
  submit(e){
    let story_Title = this.data.title;
    let story_Content = this.data.content;
    let story_Date = this.time;
    let bg_img = e.target.dataset.bg_img_url;
    let user_Id = '';
    let like_Account = 0;
    let conmmeted_Account = 0;
    // console.log(this.data.title);
    // console.log(this.data.content);
    // console.log(e.target.dataset.bg_img_url);
    const story = {
      story_Title : story_Title,
      story_Content: story_Content,
      story_Date: story_Date,
      bg_img: bg_img,
      user_Id: user_Id,
      like_Account: like_Account,
      conmmeted_Account: conmmeted_Account
    }
    productsCollection.add({
      data: story
    }).then(res => {
      console.log(res);
    })
  },
  getThis(){
    return 123;
  },
  onLoad() {
    productsCollection.get().then(res=>{
      console.log(res.data);
      
    })
    //  lifecycle
    // bg_img
    //   .get()
    //   .then(res => {
    //     // console.log(res.data);
    //     this.setData({
    //       products: res.data.bg_img
    //     })
    //   })
  },
  onShow(){
    console.log('开始编辑故事了');
    var date = new Date().toUTCString()/*.substring(0, 16)*/;
    console.log(date);
    this.setData({
      time:date
    })
  }  
})