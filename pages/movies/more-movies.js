var app = getApp();
const util = require("../../utils/util.js");

Page({

  data: {
    movies: {},
    totalCount: 0,
    requestUrl: "",
    isEmpty: true
  },

  // 下拉刷新
  onPullDownRefresh() {
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    this.setData({ movies: {}, isEmpty: true });
    util.http(refreshUrl, this.callBack); //获取数据
    wx.showNavigationBarLoading();
  },

  // 上拉刷新
  onScrollUpper() {
    this.onPullDownRefresh();
  },

  // 触底刷新
  onScrollLower() {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.callBack); //获取数据
    wx.showNavigationBarLoading();
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
    this.setData({ requestUrl: dataUrl });
    util.http(dataUrl, this.callBack);
  },

  callBack(data) {
    var movies = [], data = data.subjects, totalMovies = [];
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
    if ( !this.data.isEmpty ) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.setData({ isEmpty: false });
    }
    var totalCount = this.data.totalCount + 20;
    this.setData({ movies: totalMovies, totalCount });
    wx.hideNavigationBarLoading();
  },

  onReady() {
    wx.setNavigationBarTitle({
      title: this.data.naviCategory
    })
  }
})