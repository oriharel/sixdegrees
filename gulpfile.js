var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');
var sass = require('gulp-sass');
var $ = require('gulp-load-plugins')();

var path = {
  HTML: 'src/index.html',
  SCSS: './src/styles/*.scss',
  MINIFIED_OUT: 'build.min.js',
  OUT: 'build.js',
  FONTS: 'src/fonts/**',
  IMAGES: 'src/images/**/*',
  DEST: 'dist',
  DEST_BUILD: 'dist/build',
  DEST_SRC: 'dist/src',
  ENTRY_POINT: './src/js/main.js'
}

gulp.task('copy', function(){
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
});

gulp.task('sass', function () {
    gulp.src(path.SCSS)
        .pipe(sass())
        .pipe(gulp.dest('dist/css'));
});

// Copy Web Fonts To Dist
gulp.task('fonts', function () {
  return gulp.src(path.FONTS)
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size({title: 'fonts'}));
});

// Optimize Images
gulp.task('images', function () {
  return gulp.src(path.IMAGES)
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}));
});

gulp.task('watch', function() {
  gulp.watch(path.HTML, ['copy']);
  gulp.watch(path.SCSS, ['sass']);
  gulp.watch(path.FONTS, ['fonts']);
  gulp.watch(path.IMAGES, ['images']);

  var watcher  = watchify(browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

  return watcher.on('update', function () {
    watcher.bundle()
      .pipe(source(path.OUT))
      .pipe(gulp.dest(path.DEST_SRC))
      console.log('Updated');
  })
    .bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_SRC));
});

// gulp.task('generate-service-worker', function(callback) {
//   var fs = require('fs');
//   var path = require('path');
//   var swPrecache = require('sw-precache');
//   var rootDir = 'src/js';

//   swPrecache({
//     stripPrefix: 'http://api.themoviedb.org/3/person/popular'
//   }, function(error, swFileContents) {
//     if (error) {
//       return callback(error);
//     }
//     fs.writeFile(path.join(rootDir, 'service-worker.js'), swFileContents, callback);
//   });
// });

gulp.task('default', ['fonts', 'images', 'sass', 'copy', 'watch']);

gulp.task('build', function(){
  browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify]
  })
    .bundle()
    .pipe(source(path.MINIFIED_OUT))
    .pipe(streamify(uglify(path.MINIFIED_OUT)))
    .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task('replaceHTML', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js': 'build/' + path.MINIFIED_OUT
    }))
    .pipe(gulp.dest(path.DEST));
});

gulp.task('production', ['replaceHTML', 'build']);

