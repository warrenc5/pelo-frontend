// Include gulp
var gulp = require('gulp')
var run = require('gulp-run')
var batch = require('gulp-batch')
var file = require('gulp-file')
var util = require('gulp-util')
var gulpsync = require('gulp-sync')(gulp)
var changed = require('gulp-changed')

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

var uglify = require('gulp-uglify');
var combiner = require('stream-combiner2');
var spawn = require('child_process').spawn;
var open = require('gulp-open');
//react
var browserify = require('browserify')
//var reactify = require('reactify')
var babelify = require('babelify')
var src = require('vinyl-source-stream') // text stream for gulp
var install = require("gulp-install")
var cordova = require("cordova-lib").cordova
var cordovaCmd = require("gulp-cordova")
var cordovaServer = require('cordova-serve');
var diff = require('gulp-diff-build')

var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');

var sourcemaps = require('gulp-sourcemaps');

const env = require('get-env')({
    staging: 'staging',
    test: ['test', 'testing']
});
var packageConfig = "package.json"
var cordovaConfig = "cordova.json"
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


    //gulp.watch(paths.jsComponent + '/**/*', ['application-js'])
    gulp.watch(paths.htmlSrc + '/**/*.jade', ['copy-html'])
    gulp.watch(paths.htmlSrc + '/**/*.html', ['copy-html'])
    gulp.watch(paths.dataSrc + '/**/*', ['copy-data'])

    gulp.watch(paths.root + '/src_old/**/*', ['old'])

    gulp.watch([paths.cssDest + '/**/*', paths.jsDest + '/**/*', paths.htmlDest + '/**/*'],
        {ignoreInitial: true}).on('change',
        batch({timeout: 1000}, function (events, cb) {
            events
                .on('data', util.log)
                .on('end', browserSync.reload)
                .on('end', showBuildTime)
                .on('end', cb)
        })
    )

    gulp.watch(packageConfig, {verbose: true, ignoreInitial: false}, ['install'])
    gulp.watch(cordovaConfig, {verbose: true, ignoreInitial: false}, ['setup'])
})

/*
 npmShrinkwrap({
 dirname: process.cwd()
 }, function (err, optionalWarnings) {
 if (err) {
 throw err
 }

 optionalWarnings.forEach(function (err) {
 util.warn(err.message)
 })

 util.log("wrote npm-shrinkwrap.json")
 })
 */

var buildTime = moment().format('MMMM Do YYYY, h:mm:ss a')
var buildTimeFile = 'build.js'

gulp.task('build-time', function () {
    createBuildTime()
})

function createBuildTime() {
    buildTime = moment().format('MMMM Do YYYY, h:mm:ss a')
    console.log(`stamping build ${buildTime}`)
    var str = 'export const buildTime = \"' + buildTime + '\"'

    file(buildTimeFile, str, {src: true})
        .pipe(gulp.dest(paths.jsSrc))

    return file(buildTimeFile, str, {src: true})
        .pipe(gulp.dest(paths.jsDest))
}


var args = process.argv
gulp.task('auto', function () {
    var p;

    gulp.watch('gulpfile.js', spawnChildren)

    function spawnChildren(e) {
        util.log('gulp changed, reloading ' + JSON.stringify(args))

        gulp.start('stop')

        if (p) {
            p.kill();
        }

        //TODO relaunch the original gulp task
        //p = spawn('gulp', ['default'], {stdio: 'inherit'});
        p = spawn(args[0], args.splice(1), {stdio: 'inherit'});


    }
});

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

gulp.task('compile-js', [], function () {

    createBuildTime()
    return gulp.watch([`!${paths.jsSrc}/**/${buildTimeFile}`, paths.jsSrc + '/**/*.js', paths.jsSrc + '/**/*.jsx'], {ignoreInitial: false})
        .on('change', batch({timeout: 2500}, function (events, done) {
            events
                .on('data', util.log)
                .on('end', done)
                .on('end', function (done1) {
                    var b = browserify(paths.jsSrc + paths.mainApplicationJS)
                        .transform(babelify.configure({
                            ignore: /(node_modules)/,
                            comments: false,
                        }))
                        .bundle()
                    ////**
                    // .pipe(plumber((e) => {
                    // util.log(`*** ${e.message}\n${e.codeFrame}`)
                    // this.emit('end');
                    // }))
                    // *!/
                    ////.pipe(changed(d))*/ // Ignore unchanged files
                    return b.on('end', () => {
                            util.log(`================================ ${buildTime} ====================${env}========================`)
                            done1
                        })
                        .on('error', (e) => {
                                try {
                                    util.log(`${e.message}\n${e.codeFrame}`)
                                } catch (e) {
                                }
                                b.emit('end')
                            }
                        )

                        //var combined = combiner.obj([b])
                        .pipe(source('bundle.js'))
                        .pipe(buffer())
                        //.pipe(diff()) //takes tooo long
                        .pipe(gulp.dest(paths.jsDest))

                    //
                    //
                    //if (env == 'prod') {
                    //    util.log("production")
                    //    //.pipe(src(paths.jsDestName))
                    //    b.pipe(sourcemaps.init({loadMaps: true}))
                    //        .pipe(streamify(uglify({
                    //                mangle: false
                    //                /*{ except: ['$anchorSmoothScroll', '$classroom', '$grade', '$lesson', '$filter', ] } */
                    //            }
                    //        )))
                    //    //.pipe(sourcemaps.write('./'))
                    //}
                })
        }))

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

gulp.task('release', ['compile', 'cordova_build'], function () {
    util.log('released')
    //TODO if !exists
    //cordova/platforms/android/build/outputs/apk/android-x86-debug.apk
    //rename files
    //run shrink-wrap

})
gulp.task('compile', ['copy-images', 'copy-html', 'copy-data', 'compile-css', 'compile-js'])

gulp.task('default', ['setup', 'install', 'auto', 'start', 'compile'])


gulp.task('stop', function () {

    browserSync.exit()
})

var baseDir = process.cwd()
function readBuildTime() {
    var f = `${baseDir}/${paths.jsSrc}/${buildTimeFile}`
    //console.log(f)
    fs.readFile(f, function (e, data) {
        if (e) {
            util.log(e)
            cwd = process.cwd()
            util.log('cwd ' + cwd)
        } else {
            util.log("***" + data)
        }
    })
}

gulp.task('run', [], function () {
    process.chdir(baseDir + "/cordova")
    cwd = process.cwd()
    util.log('building ' + cwd)
    cordova.run({
        "verbose": true,
        "platforms": ["android"],
        "options": {
            argv: ["--debug"] //"--gradleArg=--no-daemon"]
        }
    }, function (e) {
        if (e) {
            util.log('build result:' + e)
        }
        util.log('run ' + buildTime)
        process.chdir(baseDir)
    })
})

gulp.task('clean-dist', [], function () {
    cwd = process.cwd()
    util.log(`deleting ${cwd}/${paths.dest}`)

    del([`${baseDir}/.gulp/gulp-diff-build`])
    return del([paths.dest + '/**/*'])
})

gulp.task('android-run', ['setup'], function (done) {
    gulp.start('cordova_run')
})

gulp.task('android', ['setup', 'auto'], function (done) {
    return gulp.watch([paths.dest + '/**/*'], {ignoreInitial: true, readDelay: 5000},
        batch({timeout: 2000}, function (events, doneBatch) {
            events
                .on('data', util.log)
                .on('end', gulp.start('cordova_run'))
        }))
})

//https://github.com/apache/cordova-lib/blob/master/cordova-lib/src/cordova/util.js#L294
gulp.task('cordova_serve', ['auto'], function (done) {

    //process.chdir(`${baseDir}/cordova/platforms/android/assets/www/`)
    process.chdir(`${baseDir}/cordova`)

    return cordova.serve({
        verbose: true,
        cwd: 'cordova',
    }, function (e) {
        if (e) {
            util.log('cordova error build result:' + e)
        } else {
            util.log('serving cordova on port 8000')
            cordovaServer.launchBrowser(opts);
            // cordova_refresh()
        }

        process.chdir(baseDir)
    })

    /*
     var opts = {}
     var platform = "android"
     cordovaServer.launchServer(opts);
     cordovaServer.servePlatform(platform, opts);
     */
})

function cordova_refresh() {
    var options = {
        uri: 'http://localhost:8000',
        app: 'google-chrome' //Just 'chrome' on Microsoft

    }

    gulp.src(__filename)
        .pipe(open(options))
}

gulp.task('cordova_build', function (done) {
    process.chdir(baseDir + "/cordova")
    cwd = process.cwd()
    util.log('building ' + cwd)
    try {
        return cordova.build({
            "verbose": true,
            "platforms": ["android"],
            "options": {
                argv: ["--release","--browserify"] //"--gradleArg=--no-daemon"]
            }
        }, function (e) {
            if (e) {
                util.log('cordova build result:' + e)
            } else {
                util.log('cordova build finshed')
            }
            process.chdir(baseDir)
            readBuildTime()
            done
        })
    } catch (e) {
        util.log(e.message + " " + e)
        done
    }
})

gulp.task('cordova_run', function (done) {

    try {
        process.chdir(baseDir + "/cordova")
        cwd = process.cwd()
        util.log('running cordova' + cwd)

        return cordova.run({
            "verbose": true,
            "platforms": ["android"],
            "options": {
                argv: ["--debug"] //"--gradleArg=--no-daemon"]
            }
        }, function (e) {
            if (e) {
                util.log('cordova run result:' + e)
            } else {
                util.log('cordova run finshed')
                //cordova_refresh()
            }
            done
            readBuildTime()
            process.chdir(baseDir)
        })
    } catch (e) {
        util.log(e.message + " " + e)
        done
    }
})

function showBuildTime() {
    util.log(buildTime)
}

function dateLog(s) {
    util.log(`${s}`)
}

//TODO use this somehow with auto to rerun the current task
gulp.task('rerun', function () {
    return run('gulp ' + this.currentTask.name).exec()  // prints "[echo] Hello World\n".
        .pipe(gulp.dest('output'))           // writes "Hello World\n" to output/echo.
})
gulp.task('install', [], function () {
    return gulp.src(packageConfig)
        .pipe(diff())
        .pipe(install())

})

gulp.task('setup', ['install'], (done)=> {
        return gulp.src(cordovaConfig)
            .pipe(diff())
            .on('error', () => {
                this.emit('end')
            })
            .pipe(cordovaCmd(undefined, {verbose: true, cwd: 'cordova'}))
    }
)

//----------------------------------------------------------------------------------------------------------------------
gulp.task('pix-resize', function (done) {
    var andRes = 'cordova/res/android/'
    var andScreenRes = 'cordova/res/screen/android/'

    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("ldpi.png"))
        .pipe(imageResize({
            imageMagick: true,
            width: 36,
            height: 36,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest(andRes)).on('error', function () {
        util.log("install http://www.graphicsmagick.org/ or http://www.imagemagick.org")
    })

    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
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
        .pipe(diff())
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
        .pipe(diff())
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
        .pipe(diff())
        .pipe(rename("splash-land-hdpi.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest(andScreenRes))

    gulp.src(paths.imgSrc + '/splash-land.png')
        .pipe(diff())
        .pipe(rename("splash-land-ldpi.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest(andScreenRes))

    gulp.src(paths.imgSrc + '/splash-land.png')
        .pipe(diff())
        .pipe(rename("splash-land-mdpi.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest(andScreenRes))

    gulp.src(paths.imgSrc + '/splash-land.png')
        .pipe(diff())
        .pipe(rename("splash-land-xhdpi.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest(andScreenRes))

    gulp.src(paths.imgSrc + '/splash-port.png')
        .pipe(diff())
        .pipe(rename("splash-port-hdpi.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest(andScreenRes))

    gulp.src(paths.imgSrc + '/splash-port.png')
        .pipe(diff())
        .pipe(rename("splash-port-ldpi.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest(andScreenRes))

    gulp.src(paths.imgSrc + '/splash-port.png')
        .pipe(diff())
        .pipe(rename("splash-port-mdpi.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false
        }))
        .pipe(gulp.dest(andScreenRes))

    gulp.src(paths.imgSrc + '/splash-port.png')
        .pipe(diff())
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

