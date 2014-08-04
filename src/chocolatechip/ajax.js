(function(){
  "use strict";
  $.extend($, {
    /*
      options = {
        url : 'the/path/here',
        type : ('GET', 'POST', PUT, 'DELETE'),
        data : myData,
        async : 'synch' || 'asynch',
        user : username (string),
        password : password (string),
        dataType : ('html', 'json', 'text', 'script', 'xml', 'form'),
        headers : {},
        success : callbackForSuccess,
        error : callbackForError,
        context: null
      }
    */
    ajax : function ( options ) {
      // Default settings:
      var settings = {
        type: 'GET',
        beforeSend: $.noop,
        success: $.noop,
        error: $.noop,
        context: null,
        async: true,
        timeout: 0
      };
      $.extend(settings, options);
      var dataTypes = {
        script: 'text/javascript, application/javascript',
        json:   'application/json',
        xml:    'application/xml, text/xml',
        html:   'text/html',
        text:   'text/plain',
        form:   'application/x-www-form-urlencoded'
      };
      var xhr = new XMLHttpRequest();
      var deferred = new $.Deferred();
      var type = settings.type || 'GET';
      var url = settings.url;
      var async = settings.async || false;
      var context = settings.context || deferred;
      if (typeof settings.data === 'object') {
        var params = [];
        for (var prop in settings.data) {
          if (settings.data.hasOwnProperty(prop)) {
            params.push(encodeURIComponent(prop)+'='+encodeURIComponent(settings.data[prop]));
          }
        }
        params = params.join('&');
      } else {
        params = settings.data || null;
      }
      if (type !== 'POST') {
        if (url.indexOf('?') == -1) {
          url += '?'+params;
        } else {
          url += '&'+params;
        }
      }
      xhr.queryString = params;
      xhr.timeout = settings.timeout ? settings.timeout : 0;
      xhr.open(type, url, async);
      if (!!settings.headers) {  
        for (var prop in settings.headers) { 
          if (settings.headers.hasOwnProperty(prop)) {
            xhr.setRequestHeader(prop, settings.headers[prop]);
          }
        }
      }
      if (settings.dataType) {
        xhr.setRequestHeader('Content-Type', dataTypes[settings.dataType]);
      }
      xhr.handleResp = settings.success; 

      var handleResponse = function() {
        if (xhr.status === 0 && xhr.readyState === 4 || xhr.status >= 200 && xhr.status < 300 && xhr.readyState === 4 || xhr.status === 304 && xhr.readyState === 4 ) {
          if (settings.dataType === 'json') {
            xhr.handleResp(JSON.parse(xhr.responseText));
            deferred.resolve(JSON.parse(xhr.responseText), settings.context, xhr);
          } else {
            xhr.handleResp(xhr.responseText);
            deferred.resolve(xhr.responseText, settings.context, xhr);
          }
        } else if (xhr.status >= 400) {
          settings.error(xhr);
          deferred.reject(xhr.status, settings.context, xhr);
        }
      };

      if (async) {
        settings.beforeSend(xhr, settings);
        xhr.onreadystatechange = handleResponse;
        xhr.send(params);
      } else {
        settings.beforeSend(xhr, settings);
        xhr.send(params);
        handleResponse();
      }
      return deferred;
    },
    
    // Parameters: url, data, success, dataType.
    get : function ( url, data, success, dataType ) {
      if (!url) {
        return;
      }
      if (!data) {
        return $.ajax({url : url, type: 'GET'}); 
      }
      if (!dataType) {
        dataType = null;
      }
      if (typeof data === 'function' && !success) {
        return $.ajax({url : url, type: 'GET', success : data});
      } else if (typeof data === 'string' || typeof data === 'object') {
        if (typeof success !== 'function') {
          success = $.noop;
        }
        return $.ajax({url : url, type: 'GET', data : data, success : success, dataType : dataType});
      }
    },
    
    // Parameters: url, data, success.
    getJSON : function ( url, data, success ) {
      if (!url) {
        return;
      }
      if (!data) {
        return $.ajax({url : url, type: 'GET', dataType : 'json'});
      }
      if (typeof data === 'function' && !success) {
        return $.ajax({url : url, type: 'GET', async: true, success : data, dataType : 'json'});
      } else if (typeof data === 'string' || typeof data === 'object') {
        if (typeof success !== 'function') {
          success = $.noop;
        }
        return $.ajax({url : url, type: 'GET', async: true, data : data, success : success, dataType : 'json'});
      }
    },

    /*
      // JSONP arguments:
      var options = {
        url: 'http:/whatever.com/stuff/here',
        callback: function() {
          // do stuff here
        },
        callbackType: 'jsonCallback=?',
        timeout: 5000
      }
    */
    JSONP : function ( options ) {
      var settings = {
        url : null,
        callback: $.noop,
        callbackType : 'callback=?',
        timeout: null
      };
      $.extend(settings, options);
      var deferred = new $.Deferred();
      var fn = 'fn_' + $.uuidNum(),
      script = document.createElement('script'),
      head = $('head')[0];
      script.setAttribute('id', fn);
      var startTimeout = new Date();
      window[fn] = function(data) {
        head.removeChild(script);
        settings.callback(data);
        deferred.resolve(data, 'resolved', settings);
        delete window[fn];
      };
      var strippedCallbackStr = settings.callbackType.substr(0, settings.callbackType.length-1);
      script.src = settings.url.replace(settings.callbackType, strippedCallbackStr + fn);
      head.appendChild(script);
      if (settings.timeout) {
        var waiting = setTimeout(function() {
          if (new Date() - startTimeout > 0) {
            deferred.reject('timedout', settings);
            settings.callback = $.noop;
          }
        }, settings.timeout);
      }
      return deferred;
    },
    
    // Parameters: url, data, success, dataType.
    post : function ( url, data, success, dataType ) {
      if (!url) {
        return;
      }
      if (!data) {
        return;
      }
      if (typeof data === 'function' && !dataType) {
        if (typeof success === 'string') {
          dataType = success;
        } else {
          dataType = 'form';
        }
        return $.ajax({url : url, type: 'POST', success : data, dataType : dataType});
      } else if (typeof data === 'string' || typeof data === 'object') {
        if (typeof success !== 'function') {
          success = $.noop;
        }
        if (!dataType) {
          dataType = 'form';
        }
        return $.ajax({url : url, type: 'POST', data : data, success : success, dataType : dataType});
      }
    }
  });
})();
