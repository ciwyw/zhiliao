// pages/addQuestion/addQuestion.js
var app = getApp()
Page({
  data: {
    question: "",
    length: 0
  },
  inputQuestion: function (e) {
    let val = e.detail.value
    this.setData({
      question: val,
      length: val.length
    })
  },
  pub: function () {
    let that = this
    if (this.data.question.length == 0) {
      app.showToast("请先输入问题描述！", that)
    }else {
      app.request("/know/add", { "token": app.globalData.token, "question": this.data.question }, function (res) {
        if (res.status == "20000") {
          wx.navigateTo({
            url: '../answerList/answerList?id=' + res.data.id + '&fromAdd=true',
          })
        }
      })
    }
  }
})