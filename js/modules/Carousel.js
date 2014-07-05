/**
* @name: Carousel
* @require: jquery
* @overview: 跑马灯的组件。
* @param {string} id
* @param {string} elemets 切换的dom模块
* @param {boolean} showBtn 是否显示左右切换按钮
* @param {boolean} showPage 是否显示分页
* @param {int} time 切换的间隔
* @author: babyzone2004@qq.com
 */
define(function(require) {
  var $ = require('jquery');
  var Carousel = function(opts) {
    var _opts = {
      id: '#slide',
      elemets: '.slide-mod',
      showBtn: true,
      showPage: true,
      time: 3000
    };
    $.extend(_opts, opts || {});
    var elemets = this.elemets = $(_opts.elemets);
    this.curNum = 0;
    this.counts = elemets.length;
    this.pages = [];
    $(elemets[0]).show();
    this._opts = _opts;
    this.init(_opts);
  };
  Carousel.prototype.init = function(opts) {
    var slide = $('#slide')
    , _self = this;
    if(opts.showBtn) {
      var prevBtn = $('<a class="slide-prev" href="#"><i class="icon-btn-left"></i></a>');
      var nextBtn = $('<a class="slide-next" href="#"><i class="icon-btn-right"></i></a>');
      slide.append(prevBtn, nextBtn);
    }
    prevBtn.on('click', function(e) {
      e.preventDefault();
      _self.prev();
    });
    nextBtn.on('click', function(e) {
      e.preventDefault();
      _self.next();
    });
    if(opts.showPage) {
      var slidePage = this.slidePage = $('<div class="slide-page"></div>');
      slide.append(slidePage);
      $(this.elemets).each(function(i, elem) {
        var page = $('<a href="#">'+ ++i +'</a>');
        _self.pages.push(page);
        slidePage.append(page);
        page.on('click', function() {
          _self.goto($(this).text());
        })
      });
      _self.pages[0].addClass('current');
    }
    var itv = setInterval(function() {_self.next()}, opts.time);
    slide.hover(
      function() {
        clearInterval(itv);
      }, 
      function() {
        itv = setInterval(function() {_self.next()}, opts.time);
      }
    );
  };
  Carousel.prototype.prev = function() {
    oldNum = this.curNum;
    if(--this.curNum < 0) {
      this.curNum = this.counts - 1;
    }
    this.fade(oldNum, this.curNum);
  };
  Carousel.prototype.next = function() {
    oldNum = this.curNum;
    if(++this.curNum >= this.counts) {
      this.curNum = 0;
    }
    this.fade(oldNum, this.curNum);
  };
  Carousel.prototype.goto = function(targetNum) {
    oldNum = this.curNum;
    this.curNum = targetNum - 1;
    this.fade(oldNum, this.curNum);
  };
  Carousel.prototype.fade = function(oldNum, curNum) {
    var elemets = this.elemets;
    $(elemets[oldNum]).fadeOut(500);
    $(elemets[curNum]).fadeIn(1000);
    this._opts.showPage && this.updatePage(oldNum, curNum);
  };
  Carousel.prototype.updatePage = function(oldNum, curNum) {
    var pages = this.pages;
    pages[oldNum].removeClass('current');
    pages[curNum].addClass('current');
  }

  return Carousel;
});