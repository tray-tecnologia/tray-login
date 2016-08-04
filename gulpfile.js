'use strict';

var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');

gulp.task('sass', function () {
  gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
    gulp.watch('./src/sass/**/*.scss', ['sass']);
    gulp.watch('./src/**/*', ['vulcanize']);
});

gulp.task('server', () => {
    browserSync({
        server: {
            baseDir: "./"
        },
        routes: {
            "/login/api": "mock",
        },
        open: false,
        files: [
            "dist/*",
            '*.html',
        ]
    });
});

gulp.task('vulcanize', function () {
    gulp.src('./src/tray-login.html')
        .pipe(vulcanize({
            inline: true,
            inlineCss: true,
            inlineScripts: true,
            excludes: [],
            stripComments: true,
            stripExcludes: false
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('dev', ['server', 'watch']);
gulp.task('default', ['sass', 'vulcanize']);
