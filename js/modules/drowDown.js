/**
* dropdown下拉菜单
* author: yangweixian
* version: 1.1.0
* date: 2012/7/12
* @description: 添加data-toggle="dropdown"，通过.open-dropdown-toggle控制
*/
define(function(require) {
  var $ = require('jquery');
  var elem = '[data-toggle="dropdown"]';
  var openDropdowns = null;
  function toggle(e) {
    var target = $(e.currentTarget),
    parent = target.parent(),
    isActive = parent.hasClass("open-dropdown-toggle");
    //先清除所有的下拉菜单
    clearMenus();
    if(!isActive) {
      parent.toggleClass('open-dropdown-toggle');
      openDropdowns = parent;
    }
    e.stopPropagation();
    $('html').on('click.dropdown.data-api', function() {
      clearMenus();
    })
  }
  function clearMenus() {
    if(openDropdowns != null){
      openDropdowns.removeClass('open-dropdown-toggle');
      openDropdowns = null;
    }
    $('html').off('click.dropdown.data-api');
  }
  $('body').on('click.dropdown.data-api', elem, toggle);
});