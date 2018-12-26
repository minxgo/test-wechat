var app = getApp();
const util = require("../../utils/util.js");

Page({

  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {}
  },

  onMoreTap(e) {
    var category = e.currentTarget.dataset.category;
    wx.navigateTo({
      url: "/pages/movies/more-movies?category=" + category,
    })
  },

  getMovieListData(url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      header: {
        "content-type": "application/json"
      },
      success(res) {
        // console.log(res.data)
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail(err) {
        console.log(err)
      }
    })
  },

  processDoubanData(moviesDouban, settedKey, categoryTitle) {
    var movies = [], data = moviesDouban.subjects;
    for (var e in data ) {
      var subject = data[e], title = subject.title;
      if ( title.length >= 6 ) {
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
    var readyData = {};
    readyData[settedKey] = {
      movies,
      categoryTitle
    };
    this.setData(readyData);
  },

  onLoad: function (options) {
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "top250");
  },

})