var gulp = require('gulp');
var webpack = require("webpack-stream");
var sass = require('gulp-sass');
var jade = require('gulp-pug');


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

gulp.task('static', function() {
    gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest('./dist/fonts/'))
})


gulp.task('default', ['css', 'js', 'html', 'static'], function() {});


gulp.watch('./src/js/**/*.{js,jsx}', ['js']);
gulp.watch('./src/sass/**/*.scss', ['css']);
gulp.watch('./src/jade/**/*.jade', ['html']);
gulp.watch('./src/**/*.*', ['static']);