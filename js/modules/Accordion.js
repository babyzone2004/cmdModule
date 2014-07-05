/**
* @name: Accordion
* @require: jquery
* @param {jquery} lis 执行手风琴的子元素
* @author: babyzone2004@qq.com
 */
define(function(require) {
  var $ = require('jquery')
  , toggle = require('./Toggle');

  var Accordion = function(lis) {
    if (lis[0]) {
      var tab = new toggle({
        total:lis.length
      });
      tab.on('afterToggle', function (e) {
        if (e.oldCurrent !== undefined && e.oldCurrent == e.current) {
          return;
        }
        var img = lis.eq(e.current).find("img");
        //延迟加载
        if(img.attr("data-src")){
          img.attr("src", img.attr("data-src"));
          img.removeAttr("data-src");
        }
        if (e.oldCurrent !== undefined) {
          lis.eq(e.oldCurrent).stop().animate({'height': '31px'}, 300, function() {
          });
        }
        lis.eq(e.current).stop().animate({'height' : '103px'}, 300, function() {
        });
      });
      lis.each(function (index, li) {
        var li = $(li), t;
        li.on({
          'mouseenter': function () {
            t = setTimeout(function () {
              tab.toggle(index);
            }, 200);
          },
          'mouseleave': function () {
            t && clearTimeout(t);
          }
        });
      });
      tab.toggle(0);
    }
  };
  return Accordion;
});