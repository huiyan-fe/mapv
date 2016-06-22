var gulp = require('gulp');
var rollup = require('gulp-rollup');
// var babel = require('gulp-babel');

var webpack = require("webpack-stream");

var sass = require('gulp-sass');

var jade = require('gulp-pug');
// var babel = require('rollup-plugin-babel');

// import babel from ;

gulp.task('css', function() {
    gulp.src('./src/sass/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('js', function() {
    gulp.src('./src/js/**/*.{js,jsx}')
        .pipe(webpack({
            output: {
                filename: 'app.js'
            },
            module: {   
                loaders: [{
                    test: /.jsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: ['es2015', 'react']
                    }
                }] 
            }
        }))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('html', function() {
    gulp.src('./src/jade/**/*.jade')
        .pipe(jade({
            client: false
        }))
        .pipe(gulp.dest('./dist/page'))
})



gulp.task('default', ['css', 'js', 'html'], function() {});


gulp.watch('./src/js/**/*.{js,jsx}', ['js']);
gulp.watch('./src/sass/**/*.scss', ['css']);
gulp.watch('./src/jade/**/*.jade', ['html']);