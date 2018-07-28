var app = getApp()
Page({
  data: {
    exam: [],
    choices: [],
    disable: false,
    examId: null,
  },
  onLoad: function (options) {
    let that = this
    that.setData({
      examId: options.examId
    })
    new Promise(function(resolve,reject) {
      app.request("/test/getDetail", { "testId": that.data.examId }, function (exam) {
          resolve(JSON.parse(exam.data.data.json))
      })
    }).then(function(temp) {
      app.request("/test/getResult", { "testId": that.data.examId, "token": app.globalData.token }, function (result) {
        if (result.data.data) {
          let choices = JSON.parse(result.data.data.json)
          for (let i = 0; i < temp.length; i++) {
            if (choices[i].status == 1) {
              temp[i].result = 1
            } else {
              temp[i].result = 0
            }
            temp[i].check = choices[i][i]
            temp[i].disable = true
          }
          that.setData({
            exam: temp,
            disable: true,
          })
        }else {
          that.setData({
            exam: temp
          })
        }
      })
    })
  },
  recodeChoice: function (e) {
    let choice = e.detail.value
    let index = e.currentTarget.id
    this.setData({
      ['choices[' + index +']']: choice
    })
  },
  checkAnswer: function () {
    let answers = this.data.exam
    let choices = this.data.choices
    let json = []
    for(let i=0;i<choices.length;i++) {
      if(answers[i].answer == choices[i]) {
        answers[i].result = 1
      }else {
        answers[i].result = 0
      }
      answers[i].check = choices[i]
      answers[i].disable = true

      let temp = {}
      temp[i] = choices[i]
      temp["status"] = answers[i].result
      json.push(temp)
    }
    this.setData({
      exam: answers,
      disable: true,
    })
    let subJson = JSON.stringify(json)
    app.request("/test/subTest", { dataArray: { "test_id": this.data.examId, "json": subJson }, "token": app.globalData.token }, function (res) {
    })
  }
})