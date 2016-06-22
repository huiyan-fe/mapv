var gulp = require('gulp');
var rollup = require('gulp-rollup');
var babel = require('gulp-babel');

var sass = require('gulp-sass');

gulp.task('default', function() {
    gulp.src('./src/js/**/*.js')
        .pipe(rollup({
            entry: './src/js/app.js'
        }))
        .pipe(babel({
            presets: ['react', 'es2015']
        }))
        .pipe(gulp.dest('./dist/js/'));

	gulp.src('./src/sass/**/*.scss')
		.pipe(sass())
        .pipe(gulp.dest('./dist/css/'));
});


gulp.watch('./src/js/**/*.js', ['default']);