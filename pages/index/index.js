//index.js
var app = getApp()
Page({
  data: {
    newCourse: [],
    list:[]
  },
  onShow: function () {
    let that = this
    that.getList()
    app.request("/class/getNewCourse", {}, function (res) {
      that.setData({
        newCourse: res.data
      })
    })
  },
  getAnswer: function (e) {
    wx.navigateTo({
      url: '../answerList/answerList?id=' + e.currentTarget.dataset.id,
    })
  },
  addQuestion: function () {
    wx.navigateTo({
      url: '../addQuestion/addQuestion',
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.getList()
    setTimeout(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 1500)
  },
  //获取实时问题列表
  getList: function () {
    let that = this
    app.request("/know/toplist",{},function(res) {
      that.setData({
        list: res.data
      })
    })
  }
})