var gulp = require('gulp'),
    del = require('del'),
    sass = require('gulp-sass'),
    gulpIf = require('gulp-if'),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    runSequence = require('run-sequence'),
    sourcemaps = require('gulp-sourcemaps'),
    fileinclude = require('gulp-file-include'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create();

// SASS
var distAssets = 'src/css/';
var sassOptions = { outputStyle: 'compressed' };
var autoprefixerOptions = { browsers: ['last 2 versions', '> 1%', 'Firefox ESR', 'ie >= 9'] };
gulp.task('sass', function () {
  return gulp
    .src('app/src/scss/**/*.scss')
    .pipe(sass(sassOptions))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// JS
var jsFiles = 'app/src/js/**/*.js',
    jsDest = 'app/js';
gulp.task('scripts', function() {
    return gulp.src(jsFiles)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest))
        .pipe(browserSync.reload({
        stream: true
      }))
});

// USEREF
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

// IMAGES
gulp.task('images', function(){
  return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/img'))
});

// FONTS
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

// CLEAN
gulp.task('clean:dist', function() {
  return del.sync('dist');
})

// LIVE RELOAD
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
    port: 3010
  })
})

// FILE INCLUDES
gulp.task('fileinclude', function() {
  gulp.src(['app/src/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('app/'))
    .pipe(browserSync.reload({
          stream: true
        }));
});

// WATCH
gulp.task('watch', ['sass', 'scripts','fileinclude', 'browserSync'], function (){
  gulp.watch('app/src/scss/**/*.scss', ['sass']);
  gulp.watch('app/src/js/**/*.js', ['scripts']);
  gulp.watch('app/src/**/*.html', ['fileinclude']);
  gulp.watch('app/src/*.html', ['fileinclude']);
  // gulp.watch('app/*.html', browserSync.reload);
  //gulp.watch('app/js/**/*.js', browserSync.reload);
});

// BUILD
gulp.task('build', [`clean`, `sass`, `useref`, `images`, `fonts`], function (){
  console.log('Building files');
});

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
});
