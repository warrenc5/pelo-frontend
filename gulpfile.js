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
var jade =  require('jade');

//react
var browserify = require('browserify');
//var reactify = require('reactify');
var babelify = require('babelify');
var source = require('vinyl-source-stream'); // text stream for gulp

//paths
var paths = new (function () {
    this.root = '.';

    // source
    this.source  = this.root + '/src';
    this.htmlSource  = this.source;
    this.cssSource   =  this.source + '/css';
    this.jsSource    =  this.source + '/js';
    //this.jsComponent = this.source + '/js-component';
    this.imgSource   =  this.source + '/img';
    this.dataSource  =  this.source + '/data';
    //this.fontSource  =  this.source + '/font';
    this.mainApplicationJS = 'app.js';

    // destination
    
    this.dist = this.root + '/cordova/www/';
    this.htmlDist = this.dist;
    this.cssDist  =  this.dist + '/css';
    this.jsDist   =  this.dist + '/js';
    this.imgDist  =  this.dist + '/img';
    this.dataDist =  this.dist + '/data';
    //this.fontDist =  this.dist/font';
    
    this.cssDistName = 'bundle.css';
    this.jsDistName = 'bundle.js';
    
})();

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
    gulp.src(paths.cssSource + '/main.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: bourbon
        }))
        .pipe(concat(paths.cssDistName))
        .pipe(gulp.dest(paths.cssDist))
        .pipe(browserSync.stream());
});

gulp.task('compile-js', function () {    
    browserify(paths.jsSource + '/' + paths.mainApplicationJS)
        .transform(babelify.configure({
            ignore: /(node_modules)/
        }))
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source(paths.jsDistName))
        .pipe(gulp.dest(paths.jsDist));
    
});

gulp.task('copy-html', function () {
    return gulp.src(paths.htmlSource + '/**/*.jade')
        .pipe(gulpJade({
            jade: jade,     
            pretty: true
        }))
        .pipe(gulp.dest(paths.htmlDist))
})

gulp.task('copy-data', function () {
    return gulp.src(paths.dataSource + '/**/*')
        .pipe(gulp.dest(paths.dataDist))
})

gulp.task('old', function () {

    gulp.src(paths.root + '/src_old/css/default.css')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: bourbon
        }))
        .pipe(concat(paths.cssDistName))
        .pipe(gulp.dest(paths.cssDist))
        .pipe(browserSync.stream());

    browserify(paths.root + '/src_old/js/index.js')
        .transform(babelify.configure({
            ignore: /(node_modules)/
        }))
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source(paths.jsDistName))
        .pipe(gulp.dest(paths.jsDist));

    return gulp.src(paths.root + '/src_old/**/*')
        .pipe(gulp.dest(paths.dist))
})

gulp.task('release', function () { 
//run shrink-wrap
})
gulp.task('compile',['copy-html', 'copy-data', 'compile-css', 'compile-js']);

gulp.task('default', ['compile','serve'])

gulp.task('serve', [], function() {
    // Fire up a web server.
    browserSync.init({
        server: {
            baseDir: './cordova/www/',
            index: 'index.html'
        },
        online: true
    });

     // Watch changes
    gulp.watch(paths.cssSource + '/**/*', ['compile-css']);
    gulp.watch(paths.jsSource + '/**/*', ['compile-js']);
    //gulp.watch(paths.jsComponent + '/**/*', ['application-js']);
    gulp.watch(paths.htmlSource + '/**/*.jade', ['copy-html']);
    gulp.watch(paths.root + '/src_old/**/*', ['old']);

    // Watch main files and reload browser.
    gulp.watch([paths.cssDist + '/**/*', paths.jsDist + '/**/*', paths.htmlDist + '/**/*']).on('change', browserSync.reload);
});
