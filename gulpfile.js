'use strict'
//utils
var gulp = require('gulp');
var rimraf = require('gulp-rimraf');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

//deploy
var ghPages = require('gulp-gh-pages');

//js
var uglify = require('gulp-uglify');

//html
var htmlmin = require('gulp-html-minifier');

//less
var csso = require('gulp-csso');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var comstrip = require('gulp-strip-css-comments');

var dist = 'dist/'

var source = {
    js: 'js/**/*.js',
    less: 'less/app.less',
    html: 'html/**/*.html',
    img: 'img/**/*'
};

var destination = {
    js: dist + 'js',
    css: dist + 'css',
    fonts: dist + 'fonts',
    html: dist,
    img: dist + 'img'
};

gulp.task('copy:bootstrap', function() {
    return gulp.src('/home/dev/Repos/pwajg-client/node_modules/bootstrap/fonts/**/*')
        .pipe(gulp.dest(destination.fonts));
});

gulp.task('copy:angular', function() {
    gulp.src('/home/dev/Repos/pwajg-client/node_modules/angular-resource/angular-resource.min.js')
        .pipe(gulp.dest(destination.js));
    gulp.src('/home/dev/Repos/pwajg-client/node_modules/angular-route/angular-route.min.js')
        .pipe(gulp.dest(destination.js));
    return gulp.src('/home/dev/Repos/pwajg-client/node_modules/angular/angular.min.js')
        .pipe(gulp.dest(destination.js));
});

gulp.task('copy:all', ['copy:bootstrap', 'copy:angular']);

gulp.task('build:less', function() {
    return gulp.src(source.less)
        .pipe(less())
        .pipe(rename('app.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(destination.css))
        .pipe(comstrip({
            preserve: false
        }))
        .pipe(rename('app.min.css'))
        .pipe(csso())
        .pipe(gulp.dest(destination.css));
});

gulp.task('build:js', function() {
    return gulp.src(source.js)
        .pipe(concat('app.js'))
        .pipe(gulp.dest(destination.js))
        .pipe(rename('app.min.js'))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(gulp.dest(destination.js));
});

gulp.task('build:html', function() {
    return gulp.src(source.html)
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(destination.html));
});

gulp.task('build:img', function() {
    return gulp.src(source.img)
        .pipe(gulp.dest(destination.img));
});

gulp.task('build:all', ['build:html', 'build:js', 'build:less', 'build:img']);

gulp.task('clean:all', function() {
    return gulp.src(dist, {
            read: false
        })
        .pipe(rimraf({
            force: true
        }));
});

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('default', ['copy:all', 'build:all']);
