var gulp = require('gulp');
var ejs  = require('gulp-ejs');
var less = require('gulp-less');
var replace = require('gulp-replace');
var path = require('path');
var clean = require('gulp-clean');
var minifyCss = require('gulp-minify-css');

gulp.task('copyiframe',function() {
    gulp.src(['./build//iframes/*']).pipe(clean());
    gulp.src(['./dev/templates/iframes/*'])
        .pipe(gulp.dest('./build/iframes'));
});
gulp.task('watch', function() {
    gulp.watch('./dev/**', ['copyiframe','ejs2htm','less2css']);
});
gulp.task('ejs2htm', function() {
    return gulp.src('./dev/templates/*.ejs')
        .pipe(ejs())
        .pipe(gulp.dest('./build'));
});
gulp.task('less2css', function () {
    return gulp.src('./dev/less/index.less')
        .pipe(less({
            paths:[path.join(__dirname,'dev','less')]
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest('./build/css/'));
});

gulp.task('replace_url', function(){
  gulp.src('./build/iframes/*.html')
    .pipe(replace(/..\/(js|css)/g, 'http://huiyan.baidu.com/mapv/demo/$1'))
    .pipe(gulp.dest('./build/iframes/'));
});

gulp.task('default', ['copyiframe','watch','ejs2htm','less2css']);
