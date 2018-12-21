var postsData = require('../../data/posts-data.js');

Page({

  data: {
    
  },

  onLoad: function (options) {
    this.setData({
      post_key: postsData.postList
    });
    // wx.clearStorageSync();
  },

  //点击跳转至详情页
  onPostClick: function(event) {
    var postId = event.currentTarget.dataset.postId
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId,
    })
  }
  
})