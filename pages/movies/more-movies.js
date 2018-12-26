var app = getApp();
const util = require("../../utils/util.js");

Page({

  data: {
    movies: {}
  },

  onLoad(options) {
    var naviCategory = options.category;
    this.setData({ naviCategory });
    var dataUrl = "";
    switch (naviCategory) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    util.http(dataUrl, this.callBack)
  },

  callBack(data) {
    var movies = [], data = data.subjects;
    for (var e in data) {
      var subject = data[e], title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title,
        average: subject.rating.average,
        movieId: subject.id,
        coverageUrl: subject.images.large,
        stars: util.convertToStars(subject.rating.stars)
      }
      movies.push(temp);
    }
    this.setData({ movies });
    console.log(this.data.movies)
  },

  onReady() {
    wx.setNavigationBarTitle({
      title: this.data.naviCategory
    })
  }
})