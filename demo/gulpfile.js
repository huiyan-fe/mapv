var gulp = require('gulp');
var ejs  = require('gulp-ejs');
var less = require('gulp-less');
var path = require('path');
var minifyCss = require('gulp-minify-css');

gulp.task('watch', function() {
    gulp.watch('./dev/**', ['ejs2htm','less2css']);
});
gulp.task('ejs2htm', function() {
    return gulp.src('./dev/templates/*.ejs')
        .pipe(ejs())
        .pipe(gulp.dest('./build/html'));
});
gulp.task('less2css', function () {
    return gulp.src('./dev/less/index.less')
        .pipe(less({
            paths:[path.join(__dirname,'dev','less')]
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest('./build/css/'));
});
gulp.task('default',['watch','ejs2htm','less2css']);
