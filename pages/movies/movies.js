var app = getApp();

Page({

  data: {
    moviesss: [
      {
        average: 7,
        coverageUrl: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2519994468.jpg",
        movieId: 326,
        title: "后来的我们"
      },
      {
        average: 7,
        coverageUrl: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2519994468.jpg",
        movieId: 326,
        title: "后来的我们"
      },
      {
        average: 7,
        coverageUrl: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2519994468.jpg",
        movieId: 326,
        title: "后来的我们"
      }
    ]
  },

  getMovieListData (url,title) {
    var that = this;
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        // console.log(res.data)
        that.processDoubanData(res.data)
      },
      fail(err) {
        console.log(err)
      }
    })
  },

  processDoubanData (moviesDouban) {
    var movies = [], data = moviesDouban.subjects;
    for (var e in data ) {
      var subject = data[e], title = subject.title;
      if ( title.length >= 6 ) {
        title = title.substring(0, 6) + '...';
      }
      var temp = {
        title: subject.title,
        average: subject.rating.average,
        movieId: subject.id,
        coverageUrl: subject.images.large
      }
      movies.push(temp);
    }
    this.setData({
      movies: movies
    })
    console.log(this.data.movies)
  },

  onLoad: function (options) {
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

    this.getMovieListData(inTheatersUrl,"inTheaters");
    this.getMovieListData(comingSoonUrl,"comingSoon");
    this.getMovieListData(top250Url,"top250");
  },

})