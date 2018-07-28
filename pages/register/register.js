// pages/register/register.js
var app = getApp()
Page({
  data: {
    email: {
      hint: "",
      color: "",
      value:null,
      right: false
    },
    pwd: {
      hint: "",
      color: "",
      value:null,
      right: false
    },
    check: {
      hint: "",
      color: "",
      value:null,
      right: false
    }
  },
  showHint: function (e) {
    let id = e.target.id, msg = ""
    if (id == "pwd") {
      msg = "6~16个字符，字母、数字或下划线"
    }
    this.setData({
      [id + ".hint"]: msg,
      [id + ".color"]: "#A69999"
    })
  },
  input: function (e) {
    let id = e.target.id
    this.setData({
      [id + ".value"]: e.detail.value
    })
  },
  checkout : function (e) {
    let reg = /^[A-Za-z0-9][\w\d-]*@[\w\d-]+(\.[\w\d-]+)+$/
    let id = e.target.id,msg = ""
    if(id == "email") {
      if (this.data.email.value && !reg.test(this.data.email.value)) {
        msg = "邮箱格式错误"
      }
    }else if(id == "pwd") {
      if (this.data.pwd.value && (this.data.pwd.value.length < 6 || this.data.pwd.value.length > 16)) {
        msg = "密码长度应为6~16个字符"
      }
    }else {
      if (this.data.check.value && (this.data.check.value != this.data.pwd.value)) {
        msg = "密码不一致"
      }
    }
    if(msg) {
      this.setData({
        [id + ".hint"]: msg,
        [id + ".color"]: "#f00"
      })
    }else {
      this.setData({
        [id + ".hint"]: "",
        [id + ".right"]: true
      })
    }
  },
  submit: function () {
    let that = this
    if(!that.data.email.value) {
      that.setData({
        ["email" + ".hint"]: "请输入邮箱",
        ["email" + ".right"]: false,
        ["email" + ".color"]: "#f00"
      })
    }
    if (!that.data.pwd.value) {
      that.setData({
        ["pwd" + ".hint"]: "请输入密码",
        ["pwd" + ".right"]: false,
        ["pwd" + ".color"]: "#f00"
      })
    }
    if (that.data.pwd.value != that.data.check.value) {
      that.setData({
        ["check" + ".hint"]: "密码不一致",
        ["check" + ".right"]: false,
        ["check" + ".color"]: "#f00"
      })
    }
    if (that.data.email.right && that.data.pwd.right && that.data.check.right) {
      let arr = {
        "openid": app.globalData.openid,
        "wx_name": app.globalData.userInfo.nickName,
        "avatar": app.globalData.userInfo.avatarUrl,
        "email": that.data.email.value,
        "pwd": that.data.pwd.value
      }
      app.request("/user/register", { "userArray": arr }, function (res) {
        if(res.data.status == "10000") {
          app.globalData.token = res.data.token
          app.globalData.user_id = res.data.id
          app.showToast("注册成功", that)
          setTimeout(function () {
            wx.switchTab({
              url: '../class/class',
            })
          }, 2000)
          if (app.onload) {
            app.onload()
          }
        }
      })
    }
  }
})