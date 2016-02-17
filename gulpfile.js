var gulp = require('gulp');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var copy = require("gulp-copy");
var babel = require("gulp-babel");
var replace = require('gulp-replace');
var browserify = require('gulp-browserify');
var stripDebug = require('gulp-strip-debug');

gulp.task('default', ['script', 'copy', 'copydemo']);

// 合并压缩文件
gulp.task('script', function() {
    return gulp.src([
        "src/start.js",
        "src/common/util.js",
        "src/common/MVCObject.js",
        "src/common/Class.js",
        "src/component/DataRange.js",
        "src/component/*.js",
        "src/Mapv.js",
        "src/event/*.js",
        "src/layer/*.js",
        "src/data/*.js",
        "src/control/*.js",
        "src/Drawer/Drawer.js",
        "src/Drawer/*.js",
        "src/end.js",
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(babel())
    .pipe(concat('Mapv.js'))
    .pipe(replace(/\/\/annotation/g, ''))
    .pipe(gulp.dest('./dist/'))
    .pipe(rename('Mapv.min.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy', ['script'], function() {
    return gulp.src("dist/Mapv*.js")
    .pipe(copy('editor/public/javascripts/', {
        prefix: 1
    }));
});

gulp.task('copydemo', ['script'], function() {
    return gulp.src("dist/Mapv*.js")
    .pipe(copy('demo/build/js/lib/', {
        prefix: 1
    }));
});

var watcher = gulp.watch('src/**/*.js', ['default']);
watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
