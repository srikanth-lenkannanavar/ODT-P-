/**
 * Created by ghanavela on 1/2/2015.
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var templateCache = require('gulp-angular-templatecache');
var minifyHTML = require('gulp-minify-html');
var obfuscate = require('gulp-obfuscate');


//gulp.task('default',function(){
gulp.task('scripts',function(){
    //gulp.src("scripts/**/*.js")
    //gulp.src("scripts/app.js")
    //gulp.src("scripts/services/*.js")
    //gulp.src("scripts/controllers/header-ctrl.js")
    gulp.src("serverscripts/**/*.js")
        .pipe(concat("all.min.js"))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest("dest"));

});

gulp.task('scripts',function(){
    //gulp.src("scripts/**/*.js")
    //gulp.src("scripts/app.js")
    //gulp.src("scripts/services/*.js")
    //gulp.src("scripts/controllers/header-ctrl.js")
    gulp.src("serverscripts/**/*.js")
        .pipe(concat("all.min.js"))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest("dest"));

});


gulp.task('template', function () {
    var opts = {empty: true};
    gulp.src('serverviews/**/*.html')
    //gulp.src('views/main.html')
        .pipe(minifyHTML(opts))
        .pipe(templateCache('otd-tpls.js',{ module:'otd-tpls', standalone:true, root: 'views/' }))
        //.pipe(gulp.dest('scripts/templates'));
        //.pipe(gulp.dest('dest/scripts/templates'));
        .pipe(concat("otd-tpls-min.js"))
        .pipe(uglify())
        .pipe(gulp.dest('dest/scripts/templates'));
});
gulp.task('templatemin', function () {
    gulp.src("scripts/templates/otd-tpls.js")
        .pipe(concat("otd-tpls-min.js"))
        .pipe(uglify())
        .pipe(gulp.dest('scripts/templates'));
});



gulp.task('htmlmin', function() {
    var htmlSrc = 'views/**/*.html',
        htmlDst = 'dest/views';
    var opts = {empty: false};
    gulp.src(htmlSrc)
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest(htmlDst));
});



gulp.task('ob', function () {
    gulp.src("scripts/app.js")
        .pipe(concat("ob.js"))
        .pipe(obfuscate())
        .pipe(gulp.dest('des/ob'));
});


