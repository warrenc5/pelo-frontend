// Include gulp
var gulp = require('gulp');

//server
var browserSync = require('browser-sync');

//sass
var sass = require('gulp-sass');
var bourbon = require('node-bourbon').includePaths;
var concat = require('gulp-concat');

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
    this.htmlSource  = this.root + '/source';
    this.cssSource   = this.root + '/source/css';
    this.jsSource    = this.root + '/source/js';
    //this.jsComponent = this.root + '/source/js-component';
    this.imgSource   = this.root + '/source/img';
    this.dataSource  = this.root + '/source/data';
    //this.fontSource  = this.root + '/source/font';
    this.mainApplicationJS = 'app.js';

    // destination
    this.htmlDist = this.root + '/dist';
    this.cssDist  = this.root + '/dist/css';
    this.jsDist   = this.root + '/dist/js';
    this.imgDist  = this.root + '/dist/img';
    this.dataDist = this.root + '/dist/data';
    //this.fontDist = this.root + '/dist/font';
    
    this.cssDistName = 'bundle.css';
    this.jsDistName = 'bundle.js';
    
})();


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
        //.transform(reactify)
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

gulp.task('default', ['copy-html', 'copy-data', 'compile-css', 'compile-js'], function() {
    // Fire up a web server.
    browserSync.init({
        server: {
            baseDir: './dist',
            index: 'index.html'
        },
        online: true
    });

     // Watch changes
    gulp.watch(paths.cssSource + '/**/*', ['compile-css']);
    gulp.watch(paths.jsSource + '/**/*', ['compile-js']);
    //gulp.watch(paths.jsComponent + '/**/*', ['application-js']);
    gulp.watch(paths.htmlSource + '/**/*.jade', ['copy-html']);

    // Watch main files and reload browser.
    gulp.watch([paths.cssDist + '/**/*', paths.jsDist + '/**/*', paths.htmlDist + '/**/*']).on('change', browserSync.reload);
});