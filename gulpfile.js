'use strict';

var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var sass = require('gulp-sass');

gulp.task('sass', function () {
  gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
    gulp.watch('./src/sass/**/*.scss', ['sass']);
    gulp.watch('./src/**/*', ['vulcanize']);
});

gulp.task('vulcanize', function () {
    gulp.src('./src/tray-login.html')
        .pipe(vulcanize({
        	inline: true,
            inlineCss: true,
            inlineScripts: true,
            excludes: [],
            stripExcludes: false
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['vulcanize', 'sass']);
