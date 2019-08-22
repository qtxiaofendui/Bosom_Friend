//index.js
const app = getApp()
const db = wx.cloud.database();
const productsCollection =
  db.collection('products');

Page({
  
  data: {
    images: [
      'https://img.yzcdn.cn/vant/apple-1.jpg',
      'https://img.yzcdn.cn/vant/apple-2.jpg'
    ],
    products: []
  },
  onLoad() {
    //  lifecycle
    productsCollection
      .get()
      .then(res => {
        // console.log(res.data);
        this.setData({
          products: res.data
        })
      })
  }
})