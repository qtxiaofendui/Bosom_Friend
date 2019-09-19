//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
    this.globalData = {
      // wyy_root: 'http://neteasecloudmusicapi.zhaoboy.com'
      wyy_root: 'http://127.0.0.1:3000'
    }
  },
  getCookies() {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: 'Cookie',
        success: result => resolve(result),
        fail: () => reject('err')
      });
    })
  },

  getWYYData(obj) {
    return this.getCookies().then(res => {
      obj.url = this.globalData.wyy_root + obj.url
      obj.header = {
        'Cookie': res.data.join(';')
      }
      return obj
    }).catch(err => {
      obj.url = this.globalData.wyy_root + obj.url
      return obj
    }).then(res => {
      return this.requestData(res)
    })
  },
  requestData(obj) {
    let {
      url,
      data,
      header,
      method,
      dataType,
      responseType
    } = obj
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: data,
        header: header,
        method: method,
        dataType: dataType,
        responseType: responseType,
        success: (result) => {
          return resolve(result)
        },
        fail: () => {
          return reject('err')
        },
        complete: () => { }
      });
    })
  }
})