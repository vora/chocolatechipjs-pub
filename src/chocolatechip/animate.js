(function(){
  "use strict";
  $.fn.extend({
    animate : function ( options ) {
      if (!this.length) return [];  
      var onEnd = null;
      var duration = duration || '.5s';
      var easing = easing || 'linear';
      var css = {};
      var transition;
      var transitionEnd;
      if ('ontransitionend' in window) {
        transition = 'transition';
        transitionEnd = 'transitionend';
      } else {
        transition = '-webkit-transition';
        transitionEnd = 'webkitTransitionEnd';
      }
      css[transition] = 'all ' + duration + ' ' + easing;
      this.forEach(function(ctx) {
        for (var prop in options) {
          if (prop === 'onEnd') {
            onEnd = options[prop];
            $(ctx).bind(transitionEnd, onEnd());
          } else {
            css[prop] = options[prop];
          }
        }
        $(ctx).css(css);
      });
      return this;
    }
  });
})();