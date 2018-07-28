// pages/download/download.js
var app = getApp()
Page({
  data: {
    name: null,
    url: null,
    logo: null,
    percent: 0
  },
  onLoad: function (options) {
    var that = this
    that.setData({
      name: options.name,
      url: options.url,
      logo: options.logo
    })
    //下载文档
    const downloadTask = wx.downloadFile({
      url: that.data.url,
      success: function (res) {
        wx.openDocument({
          filePath: res.tempFilePath,
          fail:function () {
            app.showToast("打开失败",that)
          }
        })
      },
      fail: function () {
        app.showToast("下载失败", that)
      }
    })
    downloadTask.onProgressUpdate(function (res) {
      that.setData({
        percent: res.progress
      })
    })
  }
})