(function(){
  "use strict";
  $.fn.extend({
    // This only operates on the first element in the collection.
    data : function( key, value ) {
      if (!this.length) return [];
      var id;
      var ret;
      var ctx = this[0];
      id = ctx.id;
      if (key === 'undefined' || key === null) {
        return;
      }
      if (value || value === 0) {
        var val = value;
        if (!ctx.id) {
          ++$.uuid;
          id = $.makeUuid();
          ctx.setAttribute("id", id);
          $.chch_cache.data[id] = {};
          $.chch_cache.data[id][key] = val;
        } else {
          id = ctx.id;
          if (!$.chch_cache.data[id]) {
            $.chch_cache.data[id] = {};
            $.chch_cache.data[id][key] = val;
          } else {
            $.chch_cache.data[id][key] = val;
          }
        }
      } else {
        if (key && id) {
          if (!$.chch_cache.data[id]) return;
          if ($.chch_cache.data[id][key] === 0) return $.chch_cache.data[id][key];
          if (!$.chch_cache.data[id][key]) return;
          return $.chch_cache.data[id][key];
        }
      }
     return this;
    },
    
    removeData : function ( key ) {
      if (!this.length) return [];
      this.each(function(ctx) {
        var id = ctx.getAttribute('id');
        if (!id) {
          return;
        }
        if (!$.chch_cache.data[ctx.id]) {
          return this;
        }
        if (!key) {
          delete $.chch_cache.data[id];
          return this;
        }
        if (Object.keys($.chch_cache.data[id]).length === 0) {
          delete $.chch_cache.data[id];
        } else {
          delete $.chch_cache.data[id][key];
        }
        return this;
      });
    }
  });
})();