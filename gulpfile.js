var gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  notify = require('gulp-notify'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),
  browserSync = require('browser-sync').create();

// Paths (resources)
var resources = 'resources/',
  vendor = resources + 'vendor' /* Bower packages */,
  sourceSass = resources + 'scss' /* SASS Source folder */,
  outputCss = resources + 'css' /* CSS Output folder */,
  sourceJs = resources + 'js' /* JS Source folder */,
  outputJs = resources + 'js/dist' /* JS Output folder */,
  outputJsFile = 'scripts.min.js'; /* JS Distribution file name */

// Path array
var paths = {
  scss: [sourceSass + '/**/*.scss'],

  js: [
    vendor + '/jquery/dist/jquery.min.js',
    vendor + '/respond/dest/respond.min.js',
    vendor + '/trmix/dist/trmix.min.js',
    vendor + '/html5shiv/dist/html5shiv.min.js',
    vendor +
      '/jQuery-Form-Validator/form-validator/jquery.form-validator.min.js',
    sourceJs + '/scripts.js',
  ],
};

var Helper = {
  isFileExist: function(files) {
    var fs = require('fs');
    var isAllExist = true;
    for (var i = 0; i < files.length; i++) {
      if (!fs.existsSync(files[i])) {
        console.log(files[i] + ' is missing');
        isAllExist = false;
      }
    }
    return isAllExist;
  },
};

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {
  browserSync.init({
    server: './',
  });

  gulp.watch(paths.scss, ['sass']);
  gulp.watch('*.html').on('change', browserSync.reload);
});

// Sass compile
gulp.task('sass', [], function() {
  return gulp
    .src(paths.scss)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'compressed',
      }),
    )
    .on(
      'error',
      notify.onError(function(error) {
        return error.message;
      }),
    )
    .pipe(
      notify({
        title: 'Gulp | <%= options.date %>',
        message: 'File compiled: <%= file.relative %> ',
        templateOptions: {
          date: new Date(),
        },
      }),
    )
    .pipe(sourcemaps.write('../css'))
    .pipe(gulp.dest(outputCss))
    .pipe(browserSync.stream());
});

/* --- Javascript compilers --- */
// Core Javascript compile
gulp.task('scripts', [], function() {
  var hasError = !Helper.isFileExist(paths.js);

  if (hasError) {
    return false;
  }

  return gulp
    .src(paths.js)
    .pipe(
      uglify({
        mangle: false, // mangle: Turn on or off mangling
        beautify: false, // beautify: beautify your code for debugging/troubleshooting purposes
        compress: true,
      }),
    )
    .pipe(concat(outputJsFile))
    .pipe(gulp.dest(outputJs))
    .pipe(notify('Compiled successfully!'));
});

// Watch changed files
gulp.task('watch', function() {
  gulp.watch(paths.scss, ['sass']);
});

// Gulp default task
// gulp.task( 'default', ['watch','sass'] );
gulp.task('default', ['serve']);
