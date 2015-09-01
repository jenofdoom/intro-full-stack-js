var gulp = require('gulp');
var react = require('gulp-react');
var nodemon = require('gulp-nodemon');

var assets = 'src/js/**/*.js';
var publicDir = 'public/javascripts';

gulp.task('transform', function(){
    gulp.src(assets)
        .pipe(react())
        .pipe(gulp.dest(publicDir));
});

gulp.task('demon', function () {
    nodemon({
        script: 'app.js',
        ext: 'html js',
        tasks: ['transform']
    })
    .on('restart', function () {
      console.log('restarted!');
    });
});

gulp.task('default', ['transform', 'demon']);
