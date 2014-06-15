(function(){
  "use strict";
  $.fn.extend = function ( object ) {
    return $.extend(Array.prototype, object);
  };
})();