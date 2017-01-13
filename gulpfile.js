// Include gulp
var gulp = require('gulp');
var run = require('gulp-run');

//server
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
//sass
var sass = require('gulp-sass');
var bourbon = require('node-bourbon').includePaths;
var concat = require('gulp-concat');
var gulp_plugins = require('gulp-load-plugins')();

//html
var gulpJade = require('gulp-jade');
var jade = require('jade');

//react
var browserify = require('browserify');
//var reactify = require('reactify');
var babelify = require('babelify');
var src = require('vinyl-source-stream'); // text stream for gulp

//paths
var paths = new (function () {
    this.root = '.';

    // src
    this.src = this.root + '/src';
    this.htmlSrc = this.src;
    this.cssSrc = this.src + '/css';
    this.jsSrc = this.src + '/js';
    //this.jsComponent = this.src + '/js-component';
    this.imgSrc = this.src + '/img';
    this.dataSrc = this.src + '/data';
    //this.fontSrc  =  this.src + '/font';
    this.mainApplicationJS = '/service/control.js';

    // destination

    this.dest = this.root + '/cordova/www/';
    this.htmlDest = this.dest;
    this.cssDest = this.dest + '/css';
    this.jsDest = this.dest + '/js';
    this.imgDest = this.dest + '/img';
    this.dataDest = this.dest + '/data';
    //this.fontDest =  this.dest/font';

    this.cssDestName = 'bundle.css';
    this.jsDestName = 'bundle.js';
})


var npmShrinkwrap = require("npm-shrinkwrap");

/*
 npmShrinkwrap({
 dirname: process.cwd()
 }, function (err, optionalWarnings) {
 if (err) {
 throw err;
 }

 optionalWarnings.forEach(function (err) {
 console.warn(err.message)
 })

 console.log("wrote npm-shrinkwrap.json")
 });
 */

gulp.task('compile-css', function () {

    gulp.src(paths.cssSrc + "/*.scss")
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: bourbon
        }))
        .pipe(concat(paths.cssDestName))
        .pipe(gulp.dest(paths.cssDest))
        .pipe(browserSync.stream());
    return true;
});

gulp.task('compile-js', function () {
    browserify(paths.jsSrc + '/' + paths.mainApplicationJS)
        .transform(babelify.configure({
            ignore: /(node_modules)/
        }))
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(src(paths.jsDestName))
        .pipe(gulp.dest(paths.jsDest));
    return true;
});

gulp.task('copy-html', function () {
    gulp.src(paths.htmlSrc + '/**/*.html')
        .pipe(gulp.dest(paths.htmlDest))

    gulp.src(paths.htmlSrc + '/**/*.jade')
        .pipe(gulpJade({
            jade: jade,
            pretty: true
        }))
        .pipe(gulp.dest(paths.htmlDest))
    return true;
})

gulp.task('copy-data', function () {
    return gulp.src(paths.dataSrc + '/**/*')
        .pipe(gulp.dest(paths.dataDest))
})

gulp.task('copy-images', function () {
    return gulp.src(paths.imgSrc + '/**/*')
        .pipe(gulp.dest(paths.imgDest))
})

gulp.task('release', function () {
//run shrink-wrap
})
gulp.task('compile', ['copy-images', 'copy-html', 'copy-data', 'compile-css', 'compile-js']);

gulp.task('default', ['compile', 'serve'])

gulp.task('stop', function () {
    browserSync.exit()
})

gulp.task('android', ['compile'], function () {
    return new run('cordova run android', {cwd: './cordova', verbosity: 3}).exec()
})

gulp.task('serve', [], function () {
    // Fire up a web server.
    browserSync.init({
        server: {
            baseDir: './cordova/www/',
            online: true
        }
    });
    // Watch main files and reload browser.

    // Watch changes

    gulp.watch(paths.cssSrc + '/**/*.scss', ['compile-css']);
    gulp.watch(paths.jsSrc + '/**/*.js', ['compile-js'])
    //gulp.watch(paths.jsComponent + '/**/*', ['application-js']);
    gulp.watch(paths.htmlSrc + '/**/*.jade', ['copy-html']);
    gulp.watch(paths.htmlSrc + '/**/*.html', ['copy-html']);

    gulp.watch(paths.root + '/src_old/**/*', ['old']);

    gulp.watch([paths.cssDest + '/**/*', paths.jsDest + '/**/*', paths.htmlDest + '/**/*']).on('change', browserSync.reload);

});
