//index.js
const app = getApp()
const db = wx.cloud.database();
const productsCollection =
  db.collection('products');

Page({
  
  data: {
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
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