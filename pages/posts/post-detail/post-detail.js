var postsData = require('../../../data/posts-data.js');
var app = getApp();

Page({

  data: {
    isPlay: false
  },

  //调用&显示数据
  onLoad: function (option) {
    var postId = option.id //传入的id号码
    this.setData({ postId: postId })
    var postData = postsData.postList[postId] //根据id号查找数据
    this.setData({ //页面显示数据
      postData: postData
    })

    //获取缓存
    var postsColected = wx.getStorageSync('posts_collected')
    // 存在，把页面中的图标改为蓝色图标
    if (postsColected) { //判断缓存存在情况，调取缓存
      var collected = postsColected[postId] //通过id获取缓存
      if (collected) {
        this.setData({
          collected: collected
        })
      }
    } else { //不存在，就让它存在
      var postsCollected = {} 
      postsCollected[postId] = false
      console.log(postsCollected)
      wx.setStorageSync('posts_collected', postsCollected)
    }

    //
    if (app.globalData.g_isPlay && postId === app.globalData.g_MusicPostId) {
      this.setData({
        isPlay: true
      })
    }

    this.setAudioMonitor();
  },

  setAudioMonitor: function(){
    //监听音乐播放器
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlay: true
      })
      app.globalData.g_isPlay = true
      app.globalData.g_MusicPostId = that.data.postId
    })
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlay: false
      })
      app.globalData.g_isPlay = false
      app.globalData.g_MusicPostId = null
    })
  },

  // 点击收藏
  onCollectionTap: function(event){
    // wx.clearStorageSync();
    var postsCollected = wx.getStorageSync('posts_collected')
    var collected = postsCollected[this.data.postId]
    collected = !collected //取反
    //更新
    postsCollected[this.data.postId] = collected
    
    this.showModal(postsCollected, collected);
    
  },

  showModal: function (postsCollected, collected) {
    var that = this;
    wx.showModal({
      title: '收藏',
      content: collected ? '是否收藏这篇文章' :'是否取消收藏这篇文章',
      success:function(ref) {
        if (ref.confirm) {
          wx.setStorageSync('posts_collected', postsCollected)
          // console.log(collected);
          // //更新数据绑定变量，实现切换图片
          that.setData({
            collected: collected
          })
          
        }
      }
    })
  },

  //另一个收藏方法，showToast
  sowToast:function() {
    // wx.setStorageSync('posts_collected', postsCollected)
    // // console.log(collected);
    // // //更新数据绑定变量，实现切换图片
    // this.setData({
    //   collected: collected
    // })
    //通知
    wx.showToast({
      title: collected ? '收藏成功！' : '取消成功！',
      icon: 'success',
      duration: 1000,
      mask: true
    })
  },

  onShareTap:function() {
    //分享
    wx.showActionSheet({
      itemList: [
        '分享到微信好友',
        '分享到朋友圈',
        '分享到QQ',
        '分享到新浪微博'
      ],
      success:function(res){
        console.log(res.tapIndex);
      }
    })
  },

  //音乐播放
  onMusicTap: function(event){
    var postId = this.data.postId;
    var isPlay = this.data.isPlay;
    if (isPlay) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlay: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: postsData.postList[postId].music.url,
        title: postsData.postList[postId].music.title,
        coverImgUrl: postsData.postList[postId].music.coverImgUrlurl
      })
      this.setData({
        isPlay: true
      })
    }

  }
  
})