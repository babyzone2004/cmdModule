/**
* @name: cookie
* @author: babyzone2004@qq.com
 */
define(function(require) {
  return {
    getCookie: function(name) {
      var cookie = document.cookie;
      if (cookie.length > 0) {
        var start = cookie.indexOf(name + "=");
        if (start != -1) {
          start = start + name.length + 1;
          end = cookie.indexOf(";", start);
          if (end == -1) {
            end = cookie.length;
          }
          return decodeURIComponent(cookie.substring(start, end));
        }
      }
    },
    setCookie: function(name, value, expiredays) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + expiredays);
      document.cookie = name + "=" + encodeURIComponent(value) +
      ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/";
    },
    delCookie: function(name, path) {
      if (this.getCookie(name)){
        path = path || '/';
        document.cookie = name + '=' + '; expires=Thu, 01-Jan-70 00:00:01 GMT; path=' + path;
      }
    }
  }
})