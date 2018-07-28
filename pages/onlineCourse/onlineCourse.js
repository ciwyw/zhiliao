// pages/onineCourse/onlineCourse.js
var app = getApp()
var socketOpen = false
Page({
  data: {
    historyId: null,
    value: "",
    inputVal: false,
    focus: false,
    questionList: [],
    historyInfo: {},
    hide: true
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      historyId: options.id,
      hide: false
    })
    //获取课堂信息
    app.request("/nowcourse/historyInfo", { 'historyId': that.data.historyId }, function (res) {
      that.setData({
        historyInfo: res.data.historyInfo
      })
      if (res.data.historyInfo.status == 2) {
        app.showToast("已经下课啦~", that)
        app.request("/nowcourse/getQuestion", { 'historyId': that.data.historyId, page: 2 }, function (res) {
          that.setData({
            questionList: res.data.list.reverse()
          })
        })
      } else {
        // app.request("/nowcourse/getQuestion", { historyId: that.data.historyId, page: -1 }, function (res) {
        //   that.setData({
        //     questionList: res.data.list.reverse()
        //   })
        // })
        // let timer = setInterval(function () {
        //   app.request("/nowcourse/getQuestion", { historyId: that.data.historyId, page: -1 }, function (res) {
        //     that.setData({
        //       questionList: res.data.list.reverse()
        //     })
        //   })
        //   if (that.data.hide) {
        //     clearInterval(timer)
        //   }
        // }, 1000)
        wx.connectSocket({ //创建ws连接
          url: 'wss://www.huyanet.cn/wss/'
        })
      }
    })
    wx.onSocketOpen(function (res) {
      socketOpen = true
      let json = JSON.stringify({ 'historyId': that.data.historyId, 'token': app.globalData.token, 'type': 'init' })
      wx.sendSocketMessage({
        data: json
      })

      let heartMsg = JSON.stringify({ 'type': 'heart'})
      let timer = setInterval(function() {
        wx.sendSocketMessage({
          data: heartMsg
        })
        if(that.data.hide) {
          clearInterval(timer)
        }
      },25000)
    })
    wx.onSocketMessage(function (res) {
      let list = JSON.parse(res.data)
      that.setData({
        questionList: list
      })
    })

    wx.onSocketError(function () {
      app.showToast("网络出现问题", that)
    })
  },
  onUnload: function () {
    wx.closeSocket()
    this.setData({
      hide: true
    })
  },
  getValue: function (e) {
    if (e.detail.value.length != 0) {
      this.setData({
        value: e.detail.value,
        inputVal: true
      })
    }
    else {
      this.setData({
        inputVal: false
      })
    }
  },
  getFocus: function (e) {
    this.setData({
      focus: true
    })
  },
  loseFocus: function (e) {
    this.setData({
      focus: false
    })
  },
  pushUnknown: function () {
    let that = this
    app.request("/nowcourse/addUnknow", { token: app.globalData.token, historyId: that.data.historyId}, function (res) {
      if (res.status == 30003) {
        app.showToast("已经下课啦~", that)
      } else {
        app.showToast("老师已经知道你不懂啦~", that)
      }
    })
  },
  pushQuestion: function () {
    let that = this
    if (that.data.value.length > 40) {
      app.showToast("字数超过限制啦！", that)
      return
    }
    app.request("/nowcourse/addQuestion", { token: app.globalData.token, historyId: that.data.historyId, content: that.data.value }, function (res) {
      app.showToast("发送成功!", that)
      that.setData({
        value: "",
        inputVal: false
      })
    }) 
  }
})