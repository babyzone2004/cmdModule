/*
 * hash操作
 * */
define(function(require) {
  return {
    get: function(name) {
      var arrHash = location.hash.slice(1).split('&')
      , oHash = {};
      for(var i = 0, ii = arrHash.length; i < ii; i++) {
        var arrTmp = arrHash[i].split('=');
        oHash[arrTmp[0]] = arrTmp[1];
      }
      return oHash[name];
    },
    isSuportHashChange: function() {
      return ('onhashchange' in window) && ( document.documentMode === void 0 || document.documentMode > 7 );
    }
  }
});