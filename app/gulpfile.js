/**
* Created by ghanavela on 1/2/2015.
*/
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');


//gulp.task('default',function(){
gulp.task('build',function(){
    gulp.src(["scripts/controllers/*.js","scripts/services/*.js","scripts/directives/*.js","scripts/app.js","scripts/ng-pattern-restrict.js","scripts/angular-messages.1.3.5.js"])
        .pipe(concat("all.min.js"))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest("dest2"));

});
