(function() {
  function getAllParametersByName() {
    var queryParameters = {};
    location.search.substr(1).split("&").forEach(function(param) {
      var splitParam = param.split("="),
      paramName = splitParam[0],
      paramVal = splitParam[1] && decodeURIComponent(splitParam[1]);
      (paramName in queryParameters) ? queryParameters[paramName].push(paramVal) : queryParameters[paramName] = [paramVal];
    });
    return queryParameters;
  }
  
  function getParametersByName(name) {
    return getAllParametersByName()[name];
  }
  
  function removeURLParameter(parameter) {
    var queryParameters = getAllParametersByName();
    delete queryParameters[parameter];
    var searchParts = [];
    Object.keys(queryParameters).forEach(function(key) {
      if (key !== parameter) {
        queryParameters[key].forEach(function(value) {
          searchParts.push(key + '=' + value);
        });
      }
    });
    var search = searchParts.length === 0 ? '' : '?' + searchParts.join('&');
    return location.protocol + '//' + location.hostname + ':' + location.port + location.pathname + search + location.hash;
  }
  
  var urlEvents = getParametersByName("_ev");
  if (urlEvents !== "undefined" && urlEvents.length > 0) {
    urlEvents.forEach(function(urlEvent) {
      var ev;
      try {
        ev = JSON.parse(decodeURIComponent(urlEvent));
      } catch(e) {
        ev = {};
      }
      if (ev["event"] !== "undefined") {
        dataLayer.push(ev);
      }
    });
    history.replaceState({}, document.title, removeURLParameter("_ev"));
  }
})();