/**
 * 自动补全效果suggest
 * id 输入框的id
 * submitBtn 提交按钮的id
 * suggestAjaxUrl suggestion路径
 */
define(function(require) {
  var $ = require('jquery');

  function suggestion(id, submitBtn, suggestAjaxUrl) {
    var keyInput = $(id)
    , submitBtn = $(submitBtn)
    ,  keywords
    , sv_len
    , num
    , flag = false
    , suggestValues = [] ;

    keyInput.attr("autocomplete","off");
    keyInput.parent().css("position","relative");
    if(!$(".suggestion").length){ keyInput.parent().append($("<div class='suggestion hide'></div>"));};
    keyInput.keydown(function(e){
      if(e.keyCode == 38){
         if(flag){ keywordsChange(-1);};
         return false;
      };
    });
    keyInput.keyup(function(e){
      if(e.keyCode == 38 ){
        return false;
        if(flag){ keywordsChange(-1);};
      }
      else if(e.keyCode == 40 ){
        if(flag){ keywordsChange(1);}
      }
      else{
        if( (keywords != keyInput.val()) ){
          ajax(keyInput.val());
        };
      };
    });
    var ajax = function(text){
      keywords = text;
      flag = true;
      var str = [];
      $.ajax({
        type: 'get',
        dataType: 'json',
        url: suggestAjaxUrl,
        data: { keywords : text },
        success: function (suggestData) {
          suggestValues = suggestData.suggestion;
          sv_len = suggestValues.length;
          if(sv_len){
            str.push("<ul>") ;
            for(var i = 0; i < sv_len ; i++){
              str.push("<li>");
              str.push(suggestValues[i]);
              str.push("</li>");
            };
            str.push("</ul>");
            $(".suggestion").html(str.join(""));
            $(".suggestion li").on("mouseover",trHover);
            $(".suggestion").show();
            $("body").on("click",bodyClick);
            suggestValues.push(text);
            num = sv_len ;
          }
          else{
            suggestionHide();
          };
        }
      });
    };
    var keywordsChange = function(key){
          $(".suggestion li").eq(num).removeClass("current");
          num = num + parseInt(key);
          if( num == -1 ){
            num = num + 1 + sv_len ;
          }
          else if( num == sv_len + 1 ){
            num = 0;
          };
          keyInput.prop("value", suggestValues[num]);
          $(".suggestion li").eq(num).addClass("current");
    };
    var trHover = function(){
      $(".suggestion li").removeClass("current");
      $(this).addClass("current");
      num = $(".suggestion li").index($(this));
    };
    var suggestionHide = function(e){
      $(".suggestion").hide();
      $(".num").prop("value","-1");
      flag = false;
    };
    var bodyClick = function(event){
      var eve = event.target || event.srcElement;
      var elem = $(eve);
      if(elem.parents(".suggestion").length ){
        event.stopPropagation();
        keyInput.prop("value",elem.text());
        keyInput.parent().submit();
      }else{
        suggestionHide();
      };
      $("body").off("click",bodyClick);
    };
  }
  
  return suggestion;
})