// pages/answerList/answerList.js
var app = getApp()
Page({
  data: {
    id:null,
    info:{},
    answer:[],
    value: "",
    inputVal: false,
    focus: false,
    noAnswer: false
  },
  onLoad: function (options) {
    let temp = false
    if (options.fromAdd) {
      temp = true
    }
    this.setData({
      id: options.id,
      fromAdd: temp
    })
    this.getAnswer()
  },
  onUnload: function () {
    if (this.data.fromAdd) {
      wx.switchTab({
        url: '../index/index',
      })
    }
  },
  deleteAnswer: function (e) {
    let that = this
    if (app.globalData.user_id == e.currentTarget.dataset.userid ) {
      wx.showActionSheet({
        itemList: ['删除'],
        success: function (res) {
          if(res.tapIndex == 0) {
            app.request("/know/deleteAnswer", { "token": app.globalData.token, "id": e.currentTarget.dataset.answerid }, function (res) {
              if(res.status == "20000") {
                that.getAnswer()
              }else {
                app.showToast("删除错误", that)
              }
            })
          } 
        }
      })
    }
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
  goAnswer: function () {
    let that = this
    let temp = that.data.value.replace(/\s+/g,"")
    if(temp.length == 0) {
      app.showToast("内容不能为空", that)
      that.setData({
        inputVal: false
      })
      return
    }
    app.request("/know/answer", { "token": app.globalData.token,"id": that.data.id,"answer": that.data.value }, function (res) {
      if(res.status == "20000") {
        that.setData({
          inputVal: false,
          value: ""
        })
        that.getAnswer()
      }
    })
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.getAnswer()
    setTimeout(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 1500)
  },
  //获取回答列表
  getAnswer: function () {
    let that = this
    app.request("/know/knowInfo", { "id": that.data.id }, function (res) {
      if (res.status == "22222") {
        let no = false
        if (res.data.answer.length == 0) {
          no = true
        }
        that.setData({
          info: res.data.info,
          answer: res.data.answer,
          noAnswer: no
        })
      }else {
        app.showToast("请求发生错误", that)
      }
    })
  }
})