// Include gulp
var gulp = require('gulp')
var run = require('gulp-run')
var batch = require('gulp-batch')
var file = require('gulp-file')
var moment = require('moment')
var fs = require('fs');

//server
var browserSync = require('browser-sync')
var plumber = require('gulp-plumber')
//sass
var sass = require('gulp-sass')
var bourbon = require('node-bourbon').includePaths
var concat = require('gulp-concat')
var gulp_plugins = require('gulp-load-plugins')()

//html
var gulpJade = require('gulp-jade')
var jade = require('jade')

//react
var browserify = require('browserify')
//var reactify = require('reactify')
var babelify = require('babelify')
var src = require('vinyl-source-stream') // text stream for gulp

var cordova = require("cordova-lib").cordova

//paths
var paths = new (function () {
    this.root = '.'

    // src
    this.src = this.root + '/src'
    this.htmlSrc = this.src
    this.cssSrc = this.src + '/css'
    this.jsSrc = this.src + '/js'
    //this.jsComponent = this.src + '/js-component'
    this.imgSrc = this.src + '/img'
    this.dataSrc = this.src + '/data'
    //this.fontSrc  =  this.src + '/font'
    this.mainApplicationJS = '/service/control.js'

    // destination

    this.dest = this.root + '/cordova/www/'
    this.htmlDest = this.dest
    this.cssDest = this.dest + '/css'
    this.jsDest = this.dest + '/js'
    this.imgDest = this.dest + '/img'
    this.dataDest = this.dest + '/data'
    //this.fontDest =  this.dest/font'

    this.cssDestName = 'bundle.css'
    this.jsDestName = 'bundle.js'
})


var npmShrinkwrap = require("npm-shrinkwrap")

/*
 npmShrinkwrap({
 dirname: process.cwd()
 }, function (err, optionalWarnings) {
 if (err) {
 throw err
 }

 optionalWarnings.forEach(function (err) {
 console.warn(err.message)
 })

 console.log("wrote npm-shrinkwrap.json")
 })
 */

var buildTime = moment().format('MMMM Do YYYY, h:mm:ss a');

gulp.task('build-time', function () {
    createBuildTime();
});

function createBuildTime() {
    buildTime = moment().format('MMMM Do YYYY, h:mm:ss a');
    console.log(buildTime)
    var str = 'export const buildTime = \"' + buildTime + '\"';

    return file('build.js', str, {src: true})
        .pipe(gulp.dest(paths.jsSrc));
}

gulp.task('compile-css', function () {

    gulp.src(paths.cssSrc + "/*.scss")
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: bourbon
        }))
        .pipe(concat(paths.cssDestName))
        .pipe(gulp.dest(paths.cssDest))
        .pipe(browserSync.stream())
    return true
})

gulp.task('compile-js', ['build-time'], function () {
    createBuildTime();
    browserify(paths.jsSrc + '/' + paths.mainApplicationJS)
        .transform(babelify.configure({
            ignore: /(node_modules)/
        }))
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(src(paths.jsDestName))
        .pipe(gulp.dest(paths.jsDest))
    console.log(buildTime)
    return true
})

gulp.task('copy-html', function () {
    createBuildTime();
    gulp.src(paths.htmlSrc + '/**/*.html')
        .pipe(gulp.dest(paths.htmlDest))

    gulp.src(paths.htmlSrc + '/**/*.jade')
        .pipe(gulpJade({
            jade: jade,
            pretty: true
        }))
        .pipe(gulp.dest(paths.htmlDest))
    return true
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
gulp.task('compile', ['copy-images', 'copy-html', 'copy-data', 'compile-css', 'compile-js'])

gulp.task('default', ['compile', 'serve'])

gulp.task('stop', function () {
    browserSync.exit()
})

var dir = process.cwd()
function readBuildTime() {
    fs.readFile(dir + "/src/js/build.js", function (e, data) {
        if (e) {
            console.log(e)
            cwd = process.cwd()
            console.log('cwd ' + cwd)
        } else {
            console.log("***" + data)
        }
    });
}
gulp.task('run', [], function () {
    process.chdir(dir + "/cordova")
    cwd = process.cwd()
    console.log('building ' + cwd)
    cordova.run({
        "verbose": true,
        "platforms": ["android"],
        "options": {
            argv: ["--debug"] //"--gradleArg=--no-daemon"]
        }
    }, function (e) {
        if (e) {
            console.log('build result:' + e)
        }
        console.log('run ' + buildTime)
        process.chdir(dir)
    })
})

gulp.task('android-run', [], function () {
    cordova_run()
})
gulp.task('android', [], function () {

    gulp.watch([paths.dest + '/**/*'], {ignoreInitial: true, readDelay: 10000},
        batch({timeout: 1000}, function (events, cb) {
            events
                .on('data', console.log)
                .on('end', cb)
                .on('end', cordova_run)
        }))
    cordova_serve()
})
//https://github.com/apache/cordova-lib/blob/master/cordova-lib/src/cordova/util.js#L294
function cordova_serve() {
    process.chdir(dir + "/cordova")
    cwd = process.cwd()
    console.log('serving cordova on port 8000')
    cordova.serve({
        "verbose": true
    }, function (e) {
        if (e) {
            console.log('build result:' + e)
        }
    })
    process.chdir(dir)
}

function cordova_build() {
    {
        process.chdir(dir + "/cordova")
        cwd = process.cwd()
        console.log('building ' + cwd)
        cordova.build({
            "verbose": true,
            "platforms": ["android"],
            "options": {
                argv: ["--debug"] //"--gradleArg=--no-daemon"]
            }
        }, function (e) {
            if (e) {
                console.log('build result:' + e)
            } else {
                cordova_run
            }
            process.chdir(dir)
        })
    }
}
function cordova_run() {

    process.chdir(dir + "/cordova")
    cwd = process.cwd()
    console.log('running ' + cwd)
    cordova.run({
        "verbose": true,
        "platforms": ["android"],
        "options": {
            argv: ["--debug"] //"--gradleArg=--no-daemon"]
        }
    }, function (e) {
        if (e) {
            console.log('install result:' + e)
        } else {

        }
        readBuildTime()
       process.chdir(dir)
    })
}
function reload() {
    console.log(buildTime)
}

gulp.task('serve', [], function () {
    // Fire up a web server.
    browserSync.init({
        server: {
            baseDir: paths.dest,
            online: true
        }
    })

    // Watch main files and reload browser.

    // Watch changes

    gulp.watch(paths.cssSrc + '/**/*.scss', ['compile-css'])
    gulp.watch(paths.jsSrc + '/**/*.js', ['compile-js'])
    //gulp.watch(paths.jsComponent + '/**/*', ['application-js'])
    gulp.watch(paths.htmlSrc + '/**/*.jade', ['copy-html'])
    gulp.watch(paths.htmlSrc + '/**/*.html', ['copy-html'])

    gulp.watch(paths.root + '/src_old/**/*', ['old'])

    gulp.watch([paths.cssDest + '/**/*', paths.jsDest + '/**/*', paths.htmlDest + '/**/*'],
        {ignoreInitial: true}).on('change',
        batch({timeout: 1000}, function (events, cb) {
            events
                .on('data', console.log)
                .on('end', browserSync.reload)
                .on('end', reload)
                .on('end', cb)
        })
    )

})
