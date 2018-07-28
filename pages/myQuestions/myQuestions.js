// pages/myQuestions/myQuestions.js
var app = getApp()
Page({
  data: {
    list: [],
    startX: 0
  },
  onLoad: function () {
    this.getMine()
  },
  touchStart: function (e) {
    this.data.list.forEach(function (item) {
      if (item.isTouchMove) {
        item.isTouchMove = false
      }
    })
    this.setData({
      list: this.data.list,
      startX: e.changedTouches[0].clientX
    })
  },
  touchEnd: function (e) {
    let endX = e.changedTouches[0].clientX
    let index = e.currentTarget.dataset.index
    if (endX < this.data.startX) {
      this.data.list[index].isTouchMove = true
      this.setData({
        list: this.data.list
      })
    }
  },
  deleteQuestion: function (e) {
    let that = this
    app.request("/know/delete", { "token": app.globalData.token, "id": e.currentTarget.dataset.id}, function (res) {
      if(res.status == "20001") {
        that.getMine()
      }
    })
  },
  //获取我的提问
  getMine: function () {
    let that = this
    app.request("/know/myKnow", { "token": app.globalData.token }, function (res) {
      if (res.status == "22222") {
        res.data.forEach(function (item) {
          item["isTouchMove"] = false
        })
        that.setData({
          list: res.data
        })
      }
    })
  }
})