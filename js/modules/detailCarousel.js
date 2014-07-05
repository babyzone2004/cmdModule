/**
 * @author <a href="luolaibiao@xiaomi.com">rekey</a>
 * @requires module/toggle.js
 * Creates a new toggle menu
 * @class Represents a toggle.
 * @param {jQueryObject} prevBtn
 * @param {jQueryObject} nextBtn
 * @param {jQueryObject} box
 * @param {jQueryObject} content
 * @param {Number} showNum
 * @example
 * new Carousel({
 *          prevBtn: $('#J_leftBtn'),
 *          nextBtn: $('#J_rightBtn'),
 *          box: J_thumbnail,
 *          content: $('#J_thumbnail div'),
 *          showNum: 3
 *})
 */
define(function(require) {
  var $ = require('jquery')
  , Toggle = require('./Toggle');

  /**
    * @constructor
    */
    var Carousel = function (opts) {
        this.opts = opts;
    };
    Carousel.prototype = {
        init: function () {
            var _this = this, content = _this.opts.content, box = _this.opts.box, imgs =  content.find('img');
            if (imgs.length == 0) {
                content.html('No Thumb');
                return;
            }
            var tab = new Toggle({
                total: imgs.length - _this.opts.showNum + 1,
                loop: 0
            });

            tab.on('afterToggle', function (e) {
                _this.fx(e);
                _this.preload(e);
                _this.checkBtn(e, imgs);
                imgs.each(function(i, img){
                    this.onload = function(){
                        _this.checkBtn(e, imgs);
                        _this.fx(e);
                    };
                });
            });
            tab.toggle(0);
            box.on({
                'selectstart': function () {
                    return false;
                },
                ondragstart: function () {
                    return false;
                }
            });
            this.opts.prevBtn.on('click', function (e) {
                e.preventDefault();
                tab.prev();
            });
            this.opts.nextBtn.on('click', function (e) {
                e.preventDefault();
                tab.next();
            });
        },
        fx: function (e) {
            var _this = this, content = _this.opts.content, box = _this.opts.box, imgs = content.find('img')
            , maxMargin = box.find("#J_thumbnail_wrap").width() - box.width(),curWidth = _this.getWidth(e.current, imgs);
            if(maxMargin > 0 && curWidth > maxMargin){
                e.current = e.total - 1;
                curWidth = maxMargin - 10; //修正margin偏移
            }
            content.stop(true).animate({
                'margin-left': 0 - curWidth
            }, 'fast');
        },
        getWidth: function (currentIndex, imgs) {
            var imgWidth = 0;
            imgs.each(function(i, elem){
                if(i < currentIndex){
                  imgWidth += $(elem).outerWidth(true);
                }
            });
            return imgWidth;
        },
        preload: function (e) {
            var imgs = this.opts.content.find('img');
            for (var i = e.current, len = i + this.opts.showNum + 2; i < len; i++) {
                var img = imgs.eq(i);
                img.attr('src') == 'about:blank' && img.attr('src', img.attr('data-src'));
            }
        },
        checkBtn: function (e, imgs) {
            var opts = this.opts;
            if (e.current == 0) {
                opts.prevBtn.hide('fast');
            } else {
                opts.prevBtn.show('fast');
            }
            var imgTotal = e.total;
            var boxWidth = this.opts.box.width();
            var lastThreeImgsWidth = 0;
            var flag = 0;
            for(var i = imgTotal - 1; i >= 0; i-- ){
                if(flag >= 3) break;
                flag++;
                lastThreeImgsWidth += imgs[i].width;
            }
            if ((imgTotal < 2 || e.current >= (imgTotal - 3) && lastThreeImgsWidth < boxWidth) || e.current >= (imgTotal - 1)) {
                opts.nextBtn.hide('fast');
            } else {
                opts.nextBtn.show('fast');
            }
        }
    };

    return Carousel;
});
