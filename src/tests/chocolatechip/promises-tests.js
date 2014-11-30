function assertEqual(_expr, _value) {
  function _s(x) {
    return (1/Number(x) === -Infinity) ? "-0" : (1/Number(x) === Infinity) ? "+0" : String(x);
  }

  var _x;
  try { eval("_x = (" + _expr + ")"); } catch(e) { ok(false, _expr + " threw exception: " + e); return; }
  if (_value instanceof RegExp) {
    ok(_value.test(_x), _s(_expr) + " was: " + _s(_x) + ", expected to match: " + _s(_value));
  } else if (_value !== _value) {
    ok(_x !== _x, _s(_expr) + " was: " + _s(_x) + ", expected NaN");
  } else if (_value === 0) {
    ok(1/_x === 1/_value, _s(_expr) + " was: " + _s(_x) + ", expected " + _s(_value));
  } else {
    strictEqual(_x, _value, _s(_expr) + " was: " + _s(_x) + ", expected " + _s(_value));
  }
}

// For Promise pollyfil:
var promiseObject = "[object Object]";

// Test for ES6 Promise:
if ("Promise" in window && "resolve" in window.Promise && "reject" in window.Promise && "all" in window.Promise && "race" in window.Promise) {
  promiseObject = "[object Promise]";
}

// 1:
module("Promises");
test("Basics", function() {
  expect(3);
  new Promise(function (resolve, reject) {
    equal(typeof resolve, 'function', 'resolve capability is a function');
    equal(typeof reject, 'function', 'reject capability is a function');
  });
  assertEqual("Object.prototype.toString.call(new Promise(function(){}))", promiseObject);
});

// 2:
asyncTest("Fulfill", function() {
  var fulfill;
  new Promise(function (a, b) {
    fulfill = a;
  }).then(function(value) {
    equal(value, 5);
    start();
  }, function(reason) {
    ok(false);
    start();
  });

  fulfill(5);
});

// 3:
asyncTest("Reject", function() {
  expect(1);
  var reject;
  new Promise(function (a, b) {
    reject = b;
  }).then(function(value) {
    ok(false, 'unexpected code reached');
    start();
  }, function(reason) {
    equal(reason, 5, 'rejection reason should match rejection value');
    start();
  });

  reject(5);
});

// 4:
asyncTest("Catch", function() {
  var reject;
  var p = new Promise(function (a, b) {
    reject = b;
  })['catch'](function(reason) {
    equal(reason, 5, 'catch reason should match rejection value');
    start();
  });

  reject(5);
});

// 5:
asyncTest("Multiple thens", function() {
  var fulfill;
  var p = new Promise(function (a, b) {
    fulfill = a;
  });

  var saw = [];
  p.then(function(value) {
    saw.push(value);
  });
  p.then(function(value) {
    saw.push(value);
    deepEqual(saw, [5, 5], 'multiple thens should be called with same value');
    start();
  });

  fulfill(5);
});

// 6:
asyncTest("Promise.resolve()", function() {

  var p = new Promise(function(){});
  console.log(p.toString());
  console.log(Promise.resolve(p))
  ok(Promise.resolve(p).toString() === p.toString(), 'Promise.resolve(promise) should return same promise');

  Promise.resolve(5).then(function(value) {
    equal(value, 5, 'Promise.resolve(value) should resolve');
    start();
  });
});


// 7:
asyncTest("Promise.reject()", function() {
  Promise.reject(5)['catch'](function(reason) {
    equal(reason, 5, 'Promise.reject(reason) should reject');
    start();
  });
});

// 8:
asyncTest("Promise resolved with Promise", function() {
  var fulfill;
  new Promise(function (a, b) {
    fulfill = a;
  }).then(function(value) {
    equal(value, 5, 'Promise fulfilled with Promise should resolve to actual value');
    start();
  });
  fulfill(Promise.resolve(5));
});

// 9:
asyncTest("Promise rejected with promise", function() {
  var fulfill;
  new Promise(function (a, b) {
    fulfill = a;
  })['catch'](function(value) {
    equal(value, 5, 'Promise rejected with Promise should resolve to actual value');
    start();
  });
  fulfill(Promise.reject(5));
});

// 10:
asyncTest("Promise.race()", function() {
  var f1, f2, f3;
  var p1 = new Promise(function(f, r) { f1 = f; });
  var p2 = new Promise(function(f, r) { f2 = f; });
  var p3 = new Promise(function(f, r) { f3 = f; });
  Promise.race([p1, p2, p3]).then(function(value) {
    equal(value, 2, 'Promise.race() should resolve to first fulfilled value');
    start();
  });
  f2(2);
});

// 11:
asyncTest("Promise.all() fulfill", function() {
  Promise.all([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3)
    ]).then(function(value) {
      deepEqual(value, [1,2,3], 'Promise.all should resolve to completed promises');
      start();
    });
});

// 12:
asyncTest("Promise.all() fulfill async", function() {
  var f1, f2, f3;
  var p1 = new Promise(function(f, r) { f1 = f; });
  var p2 = new Promise(function(f, r) { f2 = f; });
  var p3 = new Promise(function(f, r) { f3 = f; });
  Promise.all([p1, p2, p3]).then(function(value) {
      deepEqual(value, [1,2,3], 'Promise.all should resolve to completed promises');
      start();
    });
  f3(3);
  f2(2);
  f1(1);
});

// 13:
asyncTest("Promise.all() reject", function() {
  Promise.all([
    Promise.resolve(1),
    Promise.reject(2),
    Promise.resolve(3)
    ])['catch'](function(reason) {
      equal(reason, 2, 'Promise.all should reject if any promise rejects');
      start();
    });
});