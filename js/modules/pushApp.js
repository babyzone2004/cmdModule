/**
* App推送
*/
define(function(require) {
  var cookieHandler = require('./cookie')
  , $ = require('jquery')
  , location = window.location
  , userId = cookieHandler.getCookie('userId')
  , serviceToken = cookieHandler.getCookie('serviceToken')
  , symbols = /[`~@#$%^&*={}:;',\[\].<>/~￥……—【】‘；：”“。，、]/g;
  require('./dialog');
  $(".app-push").on('click', function (e) {
    e.preventDefault();
    var target = $(e.currentTarget)
    , id = target.attr('data-id')
    , appName = target.attr('data-name')
    , loginRootUrl = '/login?referer=' + encodeURIComponent(location.href);

    $.ajax({
      url: '/user/push/app',
      type: 'POST',
      dataType: 'json',
      data: {
        'appName': appName.replace(symbols, '-') + ".apk",
        'id': id,
        'inAjax': 1,
        'userId': userId,
        'serviceToken': serviceToken
      },
      success: function(data) {
        switch (data.code) {
          case 1:
            //判断用户是否设定“不需要提醒”
            if(!cookieHandler.getCookie('noRemind')) {
              $("#dialog-sucessful .dialog-title").text('推送成功');
              $("#dialog-sucessful p").html('已将 “' + appName +
                  '” 推送到您的手机<br />请查看手机完成安装。<br />提醒：请确保已经在手机中登录小米账户<div class="modal-noremind"><input type="checkbox" id="J-noremind" /><label for="J-noremind">不再提醒我</label></div>');
              $("#dialog-sucessful").modal({
                hasClose : false,
                autoCloseTime : 10
              });
              $("#dialog-sucessful").on("hidden", function() {
                if ($("#J-noremind")[0].checked) {
                  cookieHandler.setCookie('noRemind', true, 1);
                }
              });
            }
            var pushedText = location.pathname.indexOf("detail")!= -1 ? "已推送" : "已推";
            target.parent().parent().find(".install").addClass("pushed").text(pushedText);
            target.trigger("mouseleave");
            break;
          case 3:
            $("#dialog-sucessful .dialog-title").text('推送中');
            $("#dialog-sucessful p").text('服务器正在推送到你的手机.请耐心等待哦');
            $("#dialog-sucessful").modal({
              hasClose : false,
              autoCloseTime : 10
            });
            break;
          default:
            $("#dialog-sucessful .dialog-title").text('推送失败');
            $("#dialog-sucessful p").text('抱歉！服务器繁忙，推送失败，请稍后再试！');
            $("#dialog-sucessful").modal({
              hasClose : false,
              autoCloseTime : 9
            });
            break;
        }
      },
      statusCode: {
        401: function() {
          $("#J-login").attr("href", loginRootUrl);
          $("#dialog-login .modal-body p").text("您需要登陆小米帐号才可以安装应用到手机");
          $("#dialog-login").modal({
            hasClose : false
          });
        }
      }
    })
  })
});