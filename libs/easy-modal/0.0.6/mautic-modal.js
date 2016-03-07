!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.MauticModal=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){


(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(_dereq_,exports,module);
  } else {
    root.ouibounce = factory();
  }
}(this, function(_dereq_,exports,module) {

return function ouibounce(el, config) {
  var config     = config || {},
    aggressive   = config.aggressive || false,
    sensitivity  = setDefault(config.sensitivity, 20),
    timer        = setDefault(config.timer, 1000),
    delay        = setDefault(config.delay, 0),
    callback     = config.callback || function() {},
    cookieExpire = setDefaultCookieExpire(config.cookieExpire) || '',
    cookieDomain = config.cookieDomain ? ';domain=' + config.cookieDomain : '',
    cookieName   = config.cookieName ? config.cookieName : 'viewedOuibounceModal',
    sitewide     = config.sitewide === true ? ';path=/' : '',
    _delayTimer  = null,
    _html        = document.documentElement;

  function setDefault(_property, _default) {
    return typeof _property === 'undefined' ? _default : _property;
  }

  function setDefaultCookieExpire(days) {
    // transform days to milliseconds
    var ms = days*24*60*60*1000;

    var date = new Date();
    date.setTime(date.getTime() + ms);

    return "; expires=" + date.toUTCString();
  }

  setTimeout(attachOuiBounce, timer);
  function attachOuiBounce() {
    _html.addEventListener('mouseleave', handleMouseleave);
    _html.addEventListener('mouseenter', handleMouseenter);
    _html.addEventListener('keydown', handleKeydown);
  }

  function handleMouseleave(e) {
    if (e.clientY > sensitivity || (checkCookieValue(cookieName, 'true') && !aggressive)) return;

    _delayTimer = setTimeout(_fireAndCallback, delay);
  }

  function handleMouseenter(e) {
    if (_delayTimer) {
      clearTimeout(_delayTimer);
      _delayTimer = null;
    }
  }

  var disableKeydown = false;
  function handleKeydown(e) {
    if (disableKeydown || checkCookieValue(cookieName, 'true') && !aggressive) return;
    else if(!e.metaKey || e.keyCode !== 76) return;

    disableKeydown = true;
    _delayTimer = setTimeout(_fireAndCallback, delay);
  }

  function checkCookieValue(cookieName, value) {
    return parseCookies()[cookieName] === value;
  }

  function parseCookies() {
    // cookies are separated by '; '
    var cookies = document.cookie.split('; ');

    var ret = {};
    for (var i = cookies.length - 1; i >= 0; i--) {
      var el = cookies[i].split('=');
      ret[el[0]] = el[1];
    }
    return ret;
  }

  function _fireAndCallback() {
    fire();
    callback();
  }

  function fire() {
    // You can use ouibounce without passing an element
    // https://github.com/carlsednaoui/ouibounce/issues/30
    if (el) el.style.display = 'block';
    disable();
  }

  function disable(options) {
    var options = options || {};

    // you can pass a specific cookie expiration when using the OuiBounce API
    // ex: _ouiBounce.disable({ cookieExpire: 5 });
    if (typeof options.cookieExpire !== 'undefined') {
      cookieExpire = setDefaultCookieExpire(options.cookieExpire);
    }

    // you can pass use sitewide cookies too
    // ex: _ouiBounce.disable({ cookieExpire: 5, sitewide: true });
    if (options.sitewide === true) {
      sitewide = ';path=/';
    }

    // you can pass a domain string when the cookie should be read subdomain-wise
    // ex: _ouiBounce.disable({ cookieDomain: '.example.com' });
    if (typeof options.cookieDomain !== 'undefined') {
      cookieDomain = ';domain=' + options.cookieDomain;
    }

    if (typeof options.cookieName !== 'undefined') {
      cookieName = options.cookieName;
    }

    document.cookie = cookieName + '=true' + cookieExpire + cookieDomain + sitewide;

    // remove listeners
    _html.removeEventListener('mouseleave', handleMouseleave);
    _html.removeEventListener('mouseenter', handleMouseenter);
    _html.removeEventListener('keydown', handleKeydown);
  }

  return {
    fire: fire,
    disable: disable
  };
}
;

}));

},{}],2:[function(_dereq_,module,exports){
"use strict";var Modal=_dereq_("./modal"),Utils=_dereq_("./utils"),ouibounce=_dereq_("ouibounce"),MauticSubscribeModal=function(a,i){var o=i&&i.submittingMessage||"Please wait...",e=i&&i.ouibounce||{aggressive:!0,timer:0},t=i&&i.mauticFormId,d=i&&i.onSubmit,n=i&&i.mauticDomain,u=Modal(a,{dialogClass:"modal-dialog",backdropClass:"modal-backdrop"});if("undefined"==typeof window.MauticSDKLoaded){Utils.addEvent(window,"load",function(){window.MauticSDK.onLoad()}),window.MauticSDKLoaded=!0,window.MauticDomain=n,window.MauticLang={submittingMessage:o};var c=document.getElementsByTagName("head")[0],l=document.createElement("script");l.type="text/javascript",l.src=n+"/media/js/mautic-form.js",c.appendChild(l)}if(t){"undefined"==typeof window.MauticFormCallback&&(window.MauticFormCallback={}),"undefined"==typeof window.MauticFormCallback[t]&&(window.MauticFormCallback[t]={});var s=window.MauticFormCallback[t].onResponse;window.MauticFormCallback[t].onResponse=function(){s&&s.apply(this,arguments),d&&d(),u.hide()}}ouibounce(u,e)};module.exports=MauticSubscribeModal;


},{"./modal":4,"./utils":5,"ouibounce":1}],3:[function(_dereq_,module,exports){
module.exports='<div style="display:none;z-index:1;position:fixed;width:100%;height:100%;top:0;left:0;">\n  <div class="__modal_backdrop__" style="width:100%;height:100%;position:absolute;top:0;left:0;"></div>\n  <div class="__modal_dialog__"></div>\n</div>\n';


},{}],4:[function(_dereq_,module,exports){
"use strict";function hide(e){e.style.display="none"}function show(e){e.style.display="block"}var Utils=_dereq_("./utils"),modalHtml=_dereq_("./html/modal.html"),addEvent=Utils.addEvent,strToDom=Utils.strToDom;module.exports=function(e,o){var t=strToDom(modalHtml),a=t.getElementsByClassName("__modal_dialog__")[0],l=t.getElementsByClassName("__modal_backdrop__")[0],n="string"==typeof e?strToDom(e):e;a.appendChild(n);var d="undefined"==typeof o?{}:o,s=d.modalClass;s&&(t.className+=" "+s);var i=d.dialogClass;i&&(a.className+=" "+i);var c=d.backdropClass;c&&(l.className+=" "+c),addEvent(document.body,"click",function(){hide(t)});for(var m=t.getElementsByClassName("close"),r=function(){hide(t)},u=0;u<m.length;u++)addEvent(m[u],"click",r);return addEvent(a,"click",function(e){var o=e?e:window.event;o.cancelBubble=!0,o.stopPropagation&&o.stopPropagation()}),addEvent(window,"load",function(){document.body.appendChild(t)}),t.hide=function(){hide(t)},t.show=function(){show(t)},t};


},{"./html/modal.html":3,"./utils":5}],5:[function(_dereq_,module,exports){
"use strict";var Utils={addEvent:function(t,e,n){t.addEventListener?t.addEventListener(e,n,!1):t.attachEvent&&t.attachEvent("on"+e,function(){return n.apply(t,[window.event])})},strToDom:function(t){var e=document.createElement("div");return e.innerHTML=t,e.children[0]}};module.exports=Utils;


},{}]},{},[2])
(2)
});