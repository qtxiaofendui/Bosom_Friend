// miniprogram/pages/bindWYY/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bindAble:true,
    phone : '',
    password:''
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.showLoading({
      title: '请等待'
    });
    this.loginWYY(e.detail.value.phone, e.detail.value.password)
  },
  inputPhone(e){
    this.setData({
      phone : e.detail.value
    })
    this.checkBindAble()

  },
  inputPassword(e){
    this.setData({
      password : e.detail.value
    })
    this.checkBindAble()
  },
  checkBindAble(){
    let bindAble = this.data.phone && this.data.password ? false : true
    this.setData({
      bindAble : bindAble
    })
  },
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    alert(e.detail.encryptedData.purePhoneNumber)
    this.setData({
      phoneNum : e.detail.encryptedData.purePhoneNumber
    })
  },

  setStorage(key, value) {
    return new Promise((resolve,reject)=>{
      wx.setStorage({
        key: key,
        data: value,
        success: result => resolve(result),
        fail: err => reject(err),
        complete: () => {}
      });
    })
  },

  getUserWyyData(id,phone){
    app.getWYYData({url:`/user/detail?uid=${id}`}).then(res=>{
      console.log(res);
      this.setGlobalUserData(res.data.profile,phone)
    })
  },
  setGlobalUserData(data,phone){
    let userInfo = {}
    userInfo.name = data.nickname
    userInfo.img = data.avatarUrl
    userInfo.bgcImg = data.backgroundUrl
    userInfo.id = data.userId
    userInfo.owner = phone;
    this.setStorage('user',userInfo)
  },

  loginWYY(phone, psw) {
    app.getWYYData({
        url: `/login/cellphone?phone=${phone}&password=${psw}`
      })
      .then(res => {
        console.log(res)
        let title,icon;
        if (res.data.code === 200) {
          title = '绑定成功'
          icon = 'success'
          this.setCookie(res.cookies).then(()=>{
            this.getUserWyyData(res.data.account.id,phone)
          })
        } else {
          title = '手机或密码错误'
          icon = 'none'
        }
        wx.hideLoading();
        this.showToast(title,icon)
        console.log(res)
      }).catch(err => {
        console.log(err);
        wx.hideLoading();
        this.showToast('没有网络连接','none')
      })
  },
  showToast(title,icon){
    wx.showToast({
      title: title,
      icon: icon,
      duration: 1500,
      mask: false,
      success(res){
        if(icon == 'success'){
         wx.switchTab({
           url: '/pages/home/home',
         });
        }
        
      }
    });
  },
  setCookie(cookies) {
    let key = 'Cookie',
      value = cookies.reduce((p, v) => {
        p.push(v.split(';')[0])
        return p
      }, [])
    return this.setStorage(key, value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success (res) {
        console.log(res)
      }
    })
  },
  getPhone() {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})