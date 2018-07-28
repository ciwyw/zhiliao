//app.js
var config = require("config.js")
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    let that = this
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          withCredentials: false,
          success: function (res) {
            that.globalData.userInfo = res.userInfo
          }
        })
        if (res.code != null) {
          that.request("/user/login", { "code": res.code }, function (data) {
            if (data.status == "10001") {
              that.globalData.openid = data.data.openid
              wx.navigateTo({
                url: '/pages/register/register'
              })
            }
            else if (data.status == "10006") {
              that.globalData.token = data.data.token
              that.globalData.user_id = data.data.user_id
              if (that.onload) { //解决：在onLaunch里请求获取是否有权限，等待返回值的时候Page里的onLoad事件已执行
                that.onload()
              }
            }
          })
        }
      }
    }) 
  },
  globalData: {
    userInfo: null,
    openid: null,
    token: null,
    user_id: null
  },
  request: function (url, data, cb) {
    var that = this
    if (typeof cb !== "function") {
      console.log('error function');
      return
    }
    const requestTask = wx.request({
      url: config.host + url,
      data: data,
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        cb(res.data)
      },
      fail: function (res) {
        wx.showToast({
          title: '网络出现问题',
        })
      }
    })
    return requestTask;
  },
  showToast: function (msg, current) {
    var that = current
    setTimeout(function () {
      that.setData({
        toastText: msg,
        isShowToast: true
      })
    }, 500)
    setTimeout(function () {
      that.setData({
        isShowToast: false
      })
    }, 1500)
  },
})