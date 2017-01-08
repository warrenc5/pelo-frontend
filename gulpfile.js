// Include gulp
var gulp = require('gulp');

//server
var browserSync = require('browser-sync');

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
var source = require('vinyl-source-stream'); // text stream for gulp

//paths
var paths = new (function () {
    this.root = '.';

    // source
    this.source = this.root + '/src';
    this.htmlSrc = this.source;
    this.cssSrc = this.source + '/css';
    this.jsSrc = this.source + '/js';
    //this.jsComponent = this.source + '/js-component';
    this.imgSrc = this.source + '/img';
    this.dataSrc = this.source + '/data';
    //this.fontSrc  =  this.source + '/font';
    this.mainApplicationJS = 'app.js';

    // destination

    this.dist = this.root + '/cordova/www/';
    this.htmlDest = this.dist;
    this.cssDest = this.dist + '/css';
    this.jsDest = this.dist + '/js';
    this.imgDest = this.dist + '/img';
    this.dataDest = this.dist + '/data';
    //this.fontDest =  this.dist/font';

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

    return gulp.src(paths.cssSrc)
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: bourbon
        }))
        .pipe(concat(paths.cssDestName))
        .pipe(gulp.dest(paths.cssDest))
        .pipe(browserSync.stream());
});

gulp.task('compile-js', function () {
    return browserify(paths.jsSrc + '/' + paths.mainApplicationJS)
        .transform(babelify.configure({
            ignore: /(node_modules)/
        }))
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source(paths.jsDestName))
        .pipe(gulp.dest(paths.jsDest));

});

gulp.task('copy-html', function () {
    return gulp.src(paths.htmlSrc + '/**/*.html')
            .pipe(gulp.dest(paths.htmlDest))

        &&
        gulp.src(paths.htmlSrc + '/**/*.jade')
            .pipe(gulpJade({
                jade: jade,
                pretty: true
            }))
            .pipe(gulp.dest(paths.htmlDest))
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

gulp.task('serve', [], function () {
    // Fire up a web server.
    browserSync.init({
        server: {
            baseDir: './cordova/www/',
            index: 'index.html'
        },
        online: true
    });

    // Watch changes
    gulp.watch(paths.cssSrc + '/**/*', ['compile-css']);
    gulp.watch(paths.jsSrc + '/**/*.js', ['compile-js']);
    gulp.watch(paths.jsSrc + '/**/*.js', ['compile-js']);
    //gulp.watch(paths.jsComponent + '/**/*', ['application-js']);
    gulp.watch(paths.htmlSrc + '/**/*.jade', ['copy-html']);
    gulp.watch(paths.htmlSrc + '/**/*.html', ['copy-html']);

    gulp.watch(paths.root + '/src_old/**/*', ['old']);

    // Watch main files and reload browser.
    gulp.watch([paths.cssDest + '/**/*', paths.jsDest + '/**/*', paths.htmlDest + '/**/*']).on('change', browserSync.reload);
});
