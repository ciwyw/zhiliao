var app = getApp()
var sliderWidth = 96
Page({
  data: {
    tabs: ["测试", "课件", "记录"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    id:null,
    list: [],
    test: [],
    history:[],
    resourceList: [],
    ppt: false,
    word: false,
    excel: false,
    resource: false,
    unstart: false,
    now: false,
    end: false,
    classNow: true,
    classEnd: false
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        })
      }
    })
  },
  onShow: function() {
    this.getAll()
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    })
  },
  showList: function (e) {
    let temp = e.currentTarget.id
    if(this.data[temp] == true) {
      this.setData({
        [temp]: false
      })
    }else {
      this.setData({
        [temp]: true
      })
    }
  },
  getAll: function () {
    var that = this
    // 获取当前课程的课件列表
    app.request("/courseware/getList", { "id": that.data.id }, function (data) {
      let mylist = data.data
      for (var i = 0; i < mylist.length; i++) {
        let extention = mylist[i].courseware_name.substr(mylist[i].courseware_name.lastIndexOf(".")).toLowerCase()
        if (extention == ".ppt" || extention == ".pptx") {
          mylist[i].logo = "/images/ppt.png"
          mylist[i].type = "ppt"
        }
        else if (extention == ".doc" || extention == ".docx") {
          mylist[i].logo = "/images/Word.png"
          mylist[i].type = "word"
        }
        else if (extention == ".xls" || extention == ".xlsx") {
          mylist[i].logo = "/images/Excel.png"
          mylist[i].type = "excel"
        }
      }
      that.setData({
        list: mylist
      })
    })
    // 获取当前课程的测试列表
    app.request("/test/getList", { "classId": that.data.id }, function (testList) {
      that.setData({
        test: testList.data.list
      })
    })

    //请求上课记录
    app.request("/nowcourse/getList", { "courseId": that.data.id }, function (data) {
      that.setData({
        history: data.data.list
      })
    })
    
    //更多课程资源
    app.request("/resource/resourceGet", { "cId": that.data.id }, function (data) {
      that.setData({
        resourceList: data.data
      })
    })
  },
  goOnline: function (e) {
    let that = this
    let historyId = e.currentTarget.dataset.id
    app.request("/nowcourse/auth", { "token": app.globalData.token, "historyId": historyId }, function (data) {
      if (data.status == "30007") {
        app.showToast("请扫码加入实时课堂", that)
      }
      else if (data.status == "30008") {
        wx.navigateTo({
          url: '../onlineCourse/onlineCourse?id=' + historyId
        })
      }
    })
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.getAll()
    setTimeout(function() {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    },1500)
  }
});