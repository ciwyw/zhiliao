// pages/class/class.js
var app = getApp()
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    classList: [],
    filterList: [],
    showAdd: false,
    code: "",
    addBtn: false,
    historyId: null,
    noClass: false,
    location: null
  },
  onLoad: function () {
    let that = this
    if (app.globalData.token) {
      that.getAllClass()
    } else {//onlaunch异步请求未结束：token=null
      app.onload = () => {
        that.getAllClass()
      }
    }
  },
  onShareAppMessage: function () {
    return {
      title: "知了",
      path: "/pages/index/index",
      imageUrl: "/images/zhiliao.png"
    }
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    let that = this
    let list = that.data.classList
    that.setData({
      inputVal: e.detail.value
    })
    let newList = list.filter(function (item) {
      let name = item.course_name
      return name.match(that.data.inputVal)
    })
    that.setData({
      filterList: newList
    })
  },
  invite: function () {
    this.setData({
      addBtn: true
    })
    var that = this
    setTimeout(function () {
      that.setData({
        showAdd: true,
        addBtn: false
      })
    }, 400)
  },
  cancel: function () {
    this.setData({
      showAdd: false
    })
  },
  getValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  //加入课程
  confirm: function () {
    let that = this
    that.setData({
      showAdd: false
    })
    app.request("/class/join", { "token": app.globalData.token, "code": that.data.code }, function (data) {
      that.setData({
        showAdd: false,
        code: ""
      })
      if (data.status == "20006") {
        app.showToast("您已加入该课程", that)
      }
      else if (data.status == "20002") {
        app.showToast("成功加入课程", that)
        that.getAllClass()
      }
      else {
        app.showToast("课程加入失败", that)
      }
    })
  },
  //扫描二维码
  scan: function () {
    let that = this
    wx.scanCode({
      success: function (res) {
        let temp = JSON.parse(res.result)
        that.setData({
          historyId: temp.id
        })
        //获取位置信息
        wx.getLocation({
          success: function (res) {
            that.setData({
              location: res
            })
            app.request("/nowcourse/addhistory", { "token": app.globalData.token, "historyId": that.data.historyId, "lat": that.data.latitude, "lng": that.data.longitude }, function (list) {
              if (list.status == "30003") {
                app.showToast("暂时无法加入该课堂", that)
              }
              else if (list.status == "30004") {
                app.showToast("已经下课啦:)", that)
              }
              else {
                wx.navigateTo({
                  url: '/pages/onlineCourse/onlineCourse?id=' + that.data.historyId
                })
              }
            })
          },
          fail: function () {
            app.showToast("签到失败，无法进入在线课堂", that)
          }
        })
      }
    })
  },
  // 获取我加入的课程
  getAllClass: function () {
    let that = this
    app.request("/class/getMyJoin", { "token": app.globalData.token }, function (myclass) {
      if (myclass.status == "10005") {
        app.showToast("请求错误", that)
      } else {
        if (myclass.data.length != 0) {
          that.setData({
            classList: myclass.data,
            noClass: false
          })
        } else {
          that.setData({
            noClass: true
          })
        }
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.getAllClass()
    setTimeout(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 1500)
  }
})