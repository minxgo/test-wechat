function convertToStars(stars) {
  var num = stars.toString().substring(0,1), arr = [];
  for ( var i=0; i<5; i++ ) {
    i < num ? arr.push(1) : arr.push(0)
  }
  return arr;
}


function http (url, callBack) {
  var that = this;
  wx.request({
    url: url,
    header: {
      "content-type": "application/json"
    },
    success(res) {
      callBack(res.data)
    },
    fail(err) {
      console.log(err)
    }
  })
}

module.exports = {
  convertToStars: convertToStars,
  http: http
}