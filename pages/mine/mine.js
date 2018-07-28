// mine.js
var app = getApp()
Page({
  data: {
    userInfo: {},
    list: [
      {
        img: "/images/note.png",
        use: "我的提问",
        url: "../myQuestions/myQuestions"
      },
      {
        img: "/images/alert.png",
        use: "通知",
        url: "../notify/notify"
      },
      {
        img: "/images/help.png",
        use: "关于我们",
        url: "../information/information"
      }
    ]
  },

  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    console.log(this.data.userInfo)
  },
  goPage: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  }
})