/**
* @name: lazyload 图片延迟加载
* @require: jquery
* @author: babyzone2004@qq.com
* 
* @param {Elements} images 需要延迟加载的图片
* @param {Number} buffer 缓冲高度
* @param {Function} callback 加载单张图片的回调函数,this指针为当前加载的图片Element对象
* @param {Number} timeout 设置window窗口改变或者滑动条滚动时延迟多久加载图片
* */
define(function(require) {
  var $ = require('jquery')
  , win = $(window);

  function _load(images, callback) {
    $.each(images, function (index, image) {
        callback && callback.call(image);
        image = $(image);
        image.attr('src', image.attr('data-src'));
    });
  }

  function _getLoadIndex(sortArr, top, buffer) {
    var ret = [] , newSortArr = [] , i = 0 , len = sortArr.length , winHeight = win.height();
    for (; i < len; i++) {
        if (sortArr[i] > top - buffer && sortArr[i] < top + winHeight) {
            ret.push(sortArr[i]);
        } else {
            newSortArr.push(sortArr[i]);
        }
    }
    return {
        ret:ret,
        newSortArr:newSortArr
    };
  }

  function _getIndexData(images) {
    var cache = {} , sortArr = [];
    $.each(images, function (index, image) {
        var top = $(image).offset().top;
        if (!cache[top]) {
            sortArr.push(top);
            cache[top] = [];
        }
        cache[top].push(image);
    });
    return {
        cache:cache,
        sortArr:sortArr
    }
  }

  function lazyLoad(images, buffer, callback, timeout) {
    var _ret = _getIndexData(images), sortArr = _ret.sortArr, cache = _ret.cache, _fn = arguments.callee;
    if (!buffer) {
        return _fn(images, 200, null, null);
    }
    if ($.isFunction(buffer)) {
        return _fn(images, 200, buffer, timeout);
    }
    if (callback && !$.isFunction(callback) && !timeout) {
        return _fn(images, buffer, null, callback);
    }
    var timer = 0 , scrollHandler = function () {
        var scrollTop = win.scrollTop();
        var obj = _getLoadIndex(sortArr, scrollTop, buffer);
        sortArr = obj.newSortArr;
        $.each(obj.ret, function (index, item) {
            _load(cache[item], callback);
            delete cache[item];
        });
        if (sortArr.length == 0) {
            win.off('scroll', scrollHandler);
            win.off('resize', scrollHandler);
        }
    };
    scrollHandler();

    win.on('scroll', function () {
        timer = setTimeout(function () {
            scrollHandler();
        }, timeout);
    });
    win.on('resize', function () {
        timer = setTimeout(function () {
            scrollHandler();
        }, timeout);
    });
    win.on('load', function () {
        var images = [];
        $.each(sortArr, function (index, item) {
            $.merge(images, cache[item]);
        });
        _ret = _getIndexData(images);
        sortArr = _ret.sortArr;
        cache = _ret.cache;
    });
  }
  return lazyLoad;
});