// Import modules:
var gulp = require('gulp')
,   pkg = require('./package.json')
,   less = require('gulp-less')
,   minifyCSS = require('gulp-minify-css')
,   gutils = require('gulp-util')
,   concat = require('gulp-concat')
,   rename = require('gulp-rename')
,   replace = require('gulp-replace')
,   uglify = require('gulp-uglify')
,   jshint = require('gulp-jshint')
,   header = require('gulp-header')
,   footer = require('gulp-footer')
,   qunit = require('node-qunit-phantomjs')
,   fs = require('fs')
,   version = pkg.version;

//Add Trailing slash to projectPath if not exists.
if (pkg.projectPath !== "")
  pkg.projectPath = pkg.projectPath.replace(/\/?$/, '/');

// Define header for ChUI files:
var chocolatechipjsHeader = ['/*',
  '    pO\\',
  '   6  /\\',
  '     /OO\\',
  '    /OOOO\\',
  '   /OOOOOO\\',
  '  (OOOOOOOO)',
  '   \\:~==~:/',
  '',
  '<%= pkg.title %>',
  'Copyright ' + gutils.date("yyyy") + ' Sourcebits www.sourcebits.com',
  'License: <%= pkg.licences[0].type %>',
  'Version: <%= pkg.version %>',
  '*/\n'].join('\n');

// Define header for minfied ChUI files:
var chocolatechipjsHeaderMin = ['/*',
  '<%= pkg.title %>',
  'Copyright ' + gutils.date("yyyy") + ' Sourcebits www.sourcebits.com',
  'License: <%= pkg.licences[0].type %>',
  'Version: <%= pkg.version %>',
  '*/\n'].join('\n');

var testHeader = [
  "<!doctype html>",
  "<html>",
  "   <head>",
  "      <meta charset='UTF-8'>",
  "      <meta http-equiv='content-type' content='text/html; charset=utf-8'>",
  "      <title>QUnit ChocolateChipJS</title>",
  "      <link rel='stylesheet' href='../qunit/qunit.css'>",
  "      <script src='../../dist/chocolatechip-shopify.js'></script>",
  "      <script src='../qunit/qunit.js'></script>",
  "      <script src='../qunit/sinon.js'></script>",
  "  </head>\n"
].join('\n');

// Concat, minify and output JavaScript:
gulp.task('js', function () {
  var chuijs_start = [
    '\(function\() {',
    '  \'use strict\';'
  ].join('\n');
  var chuijs_end = '\n\}\)\();';

  gulp.src([
    "src/chocolatechip/returnResult.js",
    "src/chocolatechip/selectors.js",
    "src/chocolatechip/extend.js",
    "src/chocolatechip/core.js",
    "src/chocolatechip/plugin.js",
    "src/chocolatechip/cache.js",
    "src/chocolatechip/collection.js",
    "src/chocolatechip/domready.js",
    "src/chocolatechip/string.js",
    "src/chocolatechip/form.js",
    "src/chocolatechip/ajax.js",
    "src/chocolatechip/events.js",
    "src/chocolatechip/feature-detection.js",
    "src/chocolatechip/templates.js",
    "src/chocolatechip/pubsub.js",
    "src/chocolatechip/deferred.js",
    "src/chocolatechip/data.js",
    "src/chocolatechip/expose-chocolatechip.js"
  ])

    .pipe(replace(/^\(function\(\)\{\n  \"use strict\";/img, ''))
    .pipe(replace(/^\}\)\(\);/img, ''))
    .pipe(concat("chocolatechip-shopify.js"))
    .pipe(header(chuijs_start))
    .pipe(footer(chuijs_end))
    .pipe(header(chocolatechipjsHeader, { pkg : pkg, chuiName: pkg.title }))
    .pipe(replace(/VERSION_NUMBER/img, '\"' + version + '\"'))
    .pipe(gulp.dest(pkg.projectPath + './dist/'))
    .pipe(uglify())
    .pipe(header(chocolatechipjsHeaderMin, { pkg : pkg, chuiName: pkg.title }))
    .pipe(rename("chocolatechip-shopify.min.js"))
    .pipe(gulp.dest(pkg.projectPath + './dist/'))
});


// JSHint:
gulp.task('jshint', ['js'], function() {
  gulp.src("dist/chocolatechip-" + pkg.version + ".js")
    // jshint and options:
    .pipe(jshint({
      curly: false,
      browser: true,
      eqeqeq: true,
      forin: false,
      immed: false,
      expr: false,
      indent: false,
      noempty: true,
      plusplus: false,
      unused: false,
      boss: true,
      evil: true,
      laxbreak: true,
      multistr: true,
      scripturl: true,
      "-W030": true,
      "-W083": false
    }))
    .pipe(jshint.reporter('default'));
});

// Clean Tests:
gulp.task('clean', function() {
  if( fs.existsSync('tests/chocolatechip') ) {
    fs.readdirSync('tests/chocolatechip').forEach(function(file, index) {
      var currentPath = 'tests/chocolatechip/' + file;
        if(fs.statSync(currentPath).isDirectory()) {
          deleteFolderRecursive(currentPath);
        } else {
          fs.unlinkSync(currentPath, function (err) {
            if (err) throw err;
          });
        }
    });
  }
});

// Create Tests:
gulp.task('tests', ['jshint', 'clean'], function() {
  gulp.src('src/tests/qunit/*')
    .pipe(gulp.dest('tests/qunit'));

  gulp.src('src/tests/chocolatechip/*.js')
    .pipe(gulp.dest('tests/chocolatechip'));

  stream = gulp.src('src/tests/chocolatechip/*.html')
    .pipe(header(testHeader, {pkg: pkg}))
    .pipe(gulp.dest('tests/chocolatechip'));

  return stream;
});

// Run Tests
gulp.task('qunit', ['tests'], function(finishedCallback) {
  testCount = 0;
  testCountStream = gulp.src('tests/chocolatechip/*.html');
  testCountStream.on('data', function(file) {
    testCount++;
  });

  testCountStream.on('end', function() {
    testRunStream = gulp.src('tests/chocolatechip/*.html');
    testRunStream.on('data', function(file) {
      qunit(file.path, {}, function() {
        testCount--;
        if (testCount == 0)
          finishedCallback();
      });
    });
  });
});
/*
   Define default task:
   To build, just enter gulp in terminal.
*/
gulp.task('default', ['clean', 'js', 'jshint', 'tests', 'qunit']);
