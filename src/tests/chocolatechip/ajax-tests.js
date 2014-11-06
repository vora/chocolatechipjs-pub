module('AJAX Tests', {
  setup: function() {
    window.xhr = sinon.useFakeXMLHttpRequest();
  },
  teardown: function() {
    window.xhr.restore();
    window.xhr = null;
  }
});

// 1
test('$.post works with FormData', function() {
  var formData = new FormData();
  formData.append("name", "value");

  var request = null;
  xhr.onCreate = function(xhr) {
    request = xhr;
  };

  $.post('http://www.google.com', formData, function() {});
  ok(request, 'Should create request');
  equal(request.requestBody, formData, 'Should set requestBody');
});
