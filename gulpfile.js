// Include gulp
var gulp = require('gulp')
var run = require('gulp-run')
var batch = require('gulp-batch')
var file = require('gulp-file')
var del = require('del')
var moment = require('moment')
var fs = require('fs')
var imageResize = require('gulp-image-resize')
var rename = require("gulp-rename");
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
var install = require("gulp-install")
var cordova = require("cordova-lib").cordova
var cordovaCmd = require("gulp-cordova")

var diff = require('gulp-diff-build')
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
    this.resDest = this.root + '/cordova/res/'
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

var buildTime = moment().format('MMMM Do YYYY, h:mm:ss a')

gulp.task('build-time', function () {
    createBuildTime()
})

function createBuildTime() {
    buildTime = moment().format('MMMM Do YYYY, h:mm:ss a')
    console.log(buildTime)
    var str = 'export const buildTime = \"' + buildTime + '\"'

    return file('build.js', str, {src: true})
        .pipe(gulp.dest(paths.jsSrc))
}

gulp.task('compile-css', function () {

    gulp.src(paths.cssSrc + "/*.scss")
        .pipe(plumber())
        .pipe(diff())
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
    createBuildTime()

    browserify(paths.jsSrc + '/' + paths.mainApplicationJS)
        .transform(babelify.configure({
            ignore: /(node_modules)/
        }))
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(src(paths.jsDestName))
        .pipe(gulp.dest(paths.jsDest))

    console.log(`================================ ${buildTime} ============================================`)

    return true
})

gulp.task('copy-html', function () {
    createBuildTime()
    gulp.src(paths.htmlSrc + '/**/*.html')
        .pipe(diff())
        .pipe(gulp.dest(paths.htmlDest))

    gulp.src(paths.htmlSrc + '/**/*.jade')
        .pipe(diff())
        .pipe(gulpJade({
            jade: jade,
            pretty: true
        }))
        .pipe(gulp.dest(paths.htmlDest))
    return true
})

gulp.task('copy-data', function () {
    return gulp.src(paths.dataSrc + '/**/*')
        .pipe(diff())
        .pipe(gulp.dest(paths.dataDest))
})

gulp.task('copy-images', [], function () {
    return gulp.src(paths.imgSrc + '/**/*')
        .pipe(diff())
        .pipe(gulp.dest(paths.imgDest))
})

gulp.task('release', function () {
//run shrink-wrap
})
gulp.task('compile', ['copy-images', 'copy-html', 'copy-data', 'compile-css', 'compile-js'])

gulp.task('default', ['install','compile', 'start'])

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
    })
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

gulp.task('clean-dist', [], function () {
    cwd = process.cwd()
    console.log(`deleting ${cwd}/${paths.dest}`)

    return del([paths.dest + '/**/*'])
})

gulp.task('android-run', ['setup'], function () {
    cordova_run()
})
gulp.task('android', ['setup'], function () {

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
    process.chdir(`${dir}/cordova`)
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

gulp.task('start', [], function () {
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
    gulp.watch([paths.jsSrc + '/**/*.js*', paths.jsSrc + '/**/*.jsx'], ['compile-js'])
    //gulp.watch(paths.jsComponent + '/**/*', ['application-js'])
    gulp.watch(paths.htmlSrc + '/**/*.jade', ['copy-html'])
    gulp.watch(paths.htmlSrc + '/**/*.html', ['copy-html'])
    gulp.watch(paths.dataSrc + '/**/*', ['copy-data'])

    gulp.watch(paths.root + '/src_old/**/*', ['old'])

    gulp.watch([paths.cssDest + '/**/*', paths.jsDest + '/**/*', paths.htmlDest + '/**/*'],
        {ignoreInitial: true}).on('change',
        batch({timeout: 50}, function (events, cb) {
            events
                .on('data', console.log)
                .on('end', browserSync.reload)
                .on('end', reload)
                .on('end', cb)
        })
    )

})

gulp.task('install', function () {
    var SRC = "package.json"
    gulp.src(SRC)
        .pipe(diff())
        .pipe(install())
})

gulp.task('setup', ['install'], function () {
    SRC = "cordova.json"
    gulp.src(SRC)
        .pipe(diff())
        .pipe(cordovaCmd([{cwd: 'cordova'}]))
})

gulp.task('pix-resize', function () {
    var andRes = 'cordova/res/android/'
    var andScreenRes = 'cordova/res/screen/android/'

    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(rename("ldpi.png"))
        .pipe(imageResize({
            imageMagick: true,
            width: 36,
            height: 36,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest(andRes)).on('error', function () {
        console.log("install http://www.graphicsmagick.org/ or http://www.imagemagick.org")
    })

    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(rename("mdpi.png"))
        .pipe(imageResize({
            imageMagick: true,
            width: 48,
            height: 48,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest(andRes))

    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(rename("hdpi.png"))
        .pipe(imageResize({
            imageMagick: true,
            width: 72,
            height: 72,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest(andRes))

    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(rename("xhdpi.png"))
        .pipe(imageResize({
            imageMagick: true,
            width: 96,
            height: 96,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest(andRes))

    gulp.src(paths.imgSrc + '/splash-land.png')
        .pipe(rename("splash-land-hdpi.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest(andScreenRes))

    gulp.src(paths.imgSrc + '/splash-land.png')
        .pipe(rename("splash-land-ldpi.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest(andScreenRes))

    gulp.src(paths.imgSrc + '/splash-land.png')
        .pipe(rename("splash-land-mdpi.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest(andScreenRes))

    gulp.src(paths.imgSrc + '/splash-land.png')
        .pipe(rename("splash-land-xhdpi.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest(andScreenRes))

    gulp.src(paths.imgSrc + '/splash-port.png')
        .pipe(rename("splash-port-hdpi.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest(andScreenRes))

    gulp.src(paths.imgSrc + '/splash-port.png')
        .pipe(rename("splash-port-ldpi.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest(andScreenRes))

    gulp.src(paths.imgSrc + '/splash-port.png')
        .pipe(rename("splash-port-mdpi.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest(andScreenRes))

    gulp.src(paths.imgSrc + '/splash-port.png')
        .pipe(rename("splash-port-xhdpi.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest(andScreenRes))


    /** TODO
     <icon src="res/ios/icon-60@3x.png" width="180" height="180"/>
     <!-- iOS 7.0+ -->
     <!-- iPhone / iPod Touch  -->
     <icon src="res/ios/icon-60.png" width="60" height="60"/>
     <icon src="res/ios/icon-60@2x.png" width="120" height="120"/>
     <!-- iPad -->
     <icon src="res/ios/icon-76.png" width="76" height="76"/>
     <icon src="res/ios/icon-76@2x.png" width="152" height="152"/>
     <!-- iOS 6.1 -->
     <!-- Spotlight Icon -->
     <icon src="res/ios/icon-40.png" width="40" height="40"/>
     <icon src="res/ios/icon-40@2x.png" width="80" height="80"/>
     <!-- iPhone / iPod Touch -->
     <icon src="res/ios/icon.png" width="57" height="57"/>
     <icon src="res/ios/icon@2x.png" width="114" height="114"/>
     <!-- iPad -->
     <icon src="res/ios/icon-72.png" width="72" height="72"/>
     <icon src="res/ios/icon-72@2x.png" width="144" height="144"/>
     <!-- iPhone Spotlight and Settings Icon -->
     <icon src="res/ios/icon-small.png" width="29" height="29"/>
     <icon src="res/ios/icon-small@2x.png" width="58" height="58"/>
     <!-- iPad Spotlight and Settings Icon -->
     <icon src="res/ios/icon-50.png" width="50" height="50"/>
     <icon src="res/ios/icon-50@2x.png" width="100" height="100"/>

     <splash src="res/screen/ios/Default~iphone.png" width="320" height="480"/>
     <splash src="res/screen/ios/Default@2x~iphone.png" width="640" height="960"/>
     <splash src="res/screen/ios/Default-Portrait~ipad.png" width="768" height="1024"/>
     <splash src="res/screen/ios/Default-Portrait@2x~ipad.png" width="1536" height="2048"/>
     <splash src="res/screen/ios/Default-Landscape~ipad.png" width="1024" height="768"/>
     <splash src="res/screen/ios/Default-Landscape@2x~ipad.png" width="2048" height="1536"/>
     <splash src="res/screen/ios/Default-568h@2x~iphone.png" width="640" height="1136"/>
     <splash src="res/screen/ios/Default-667h.png" width="750" height="1334"/>
     <splash src="res/screen/ios/Default-736h.png" width="1242" height="2208"/>
     <splash src="res/screen/ios/Default-Landscape-736h.png" width="2208" height="1242"/>
     **/

})

