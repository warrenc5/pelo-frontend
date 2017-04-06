// Include gulp
var gulp = require('gulp')
var run = require('gulp-run')
var batch = require('gulp-batch')
var file = require('gulp-file')
var util = require('gulp-util')
var gulpsync = require('gulp-sync')(gulp)
var changed = require('gulp-changed')
var clean = require('gulp-clean')

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
var touch = require('gulp-touch');
var packageConfig = "package.json"
var cordovaConfig = "cordova/config.xml"
var cordovaCmds = "cordova.json"
//paths
var paths = new (function () {
    this.root = process.cwd()

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
    this.buildTimeFile = this.jsSrc + '/build.js'

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
    gulp.watch([paths.jsSrc + '/**/*.js', paths.jsSrc + '/**/*.jsx', '!' + paths.buildTimeFile], {ignoreInitial: false})
        .on('change', batch({timeout: 2500}, function (events, done) {
            events
                .on('data', util.log)
                .on('end', done)
                .on('end', function (done1) {
                    return gulp.start('compile-js')
                })
        }))

    //gulp.watch(paths.jsComponent + '/**/*', ['application-js'])
    gulp.watch(paths.htmlSrc + '/**/*.jade', ['copy-html'])
    gulp.watch(paths.htmlSrc + '/**/*.html', ['copy-html'])
    gulp.watch(paths.dataSrc + '/**/*', ['copy-data'])

    gulp.watch(paths.root + '/src_old/**/*', ['old'])

    gulp.watch([paths.cssDest + '/**/*', paths.jsDest + '/**/*', paths.htmlDest + '/**/*', "!" + paths.jsDest + "/cordova/**/*", "!" + paths.jsDest + "/" + buildTimeFile],
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


gulp.task('shrinkwrap', [], function () {
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
})

var buildTimeFile = 'build.js'
var buildTime = moment().format('MMMM Do YYYY, h:mm:ss a')

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

    gulp.watch('gulpfile.js', {ignoreInitial: false})
        .on('change', batch({timeout: 2200}, function (events, done) {
            events
                .on('data', util.log)
                .on('end', done)
                .on('end', spawnChildren)
        }))

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

gulp.task('compile-js', [], function (done1) {

    gulp.start('build-time')

    var b = browserify([`${paths.jsSrc}/${paths.mainApplicationJS}`])
        .transform(babelify.configure({
            env: {
                production: {}, development: {}
            },
            minified: env == 'prod',
            ignore: ['/node_modules/**'],
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
    var c = b.on('end', () => {
            util.log(`================================ ${buildTime} ====================${env}========================`)
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

    //
    //
    if (env == 'prod') {
        util.log("production")
        //.pipe(src(paths.jsDestName))
        c = c.pipe(sourcemaps.init({loadMaps: true}))
            .pipe(streamify(uglify({
                    mangle: false
                    /*{ except: ['$anchorSmoothScroll', '$classroom', '$grade', '$lesson', '$filter', ] } */
                }
            )))
            .pipe(gulp.dest(paths.jsDest))

        //.pipe(sourcemaps.write('./'))
    }
    return c.pipe(gulp.dest(paths.jsDest))
})


gulp.task('copy-html', function () {
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

gulp.task('release', gulpsync.sync(['setup', 'compile', 'cordova_build', 'shrinkwrap']), function () {
    util.log('released')
    //TODO if !exists
    //cordova/platforms/android/build/outputs/apk/android-x86-debug.apk
    //rename files
    //run shrink-wrap

})

gulp.task('touch', function (done) {
    gulp.src(paths.jsSrc + '/index.js')
        .pipe(touch());
})
gulp.task('compile', ['copy-images', 'copy-html', 'copy-data', 'compile-css', 'compile-js'])

gulp.task('default', ['setup', 'install', 'auto', 'start', 'compile'])


gulp.task('stop', function (done) {
    browserSync.exit()
})

function readBuildTime() {
    var f = `${paths.buildTimeFile}`
    //console.log(f)
    fs.readFile(f, function (e, data) {
        if (e) {
            util.log(e)
            util.log('cwd ' + process.cwd)
        } else {
            util.log("***" + data)
        }
    })
}

gulp.task('run', [], function () {
    process.chdir(paths.root + "/cordova")

    util.log('building ' + process.cwd())
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
        process.chdir(paths.root)
    })
})

gulp.task('clean', gulpsync.sync(['cordova_clean']), function (done) {

    //`${paths.root}/cordova/platforms/**`,
    //`!${paths.root}/cordova/platforms`,

    return del([`${paths.root}/.gulp/gulp-diff-build/hash.json`,
            `${paths.root}/cordova/www/**`,
            `!${paths.root}/cordova/www`
        ],
        {dryRun: false, force: true}).then(paths => {
        console.log('Files and folders that are deleted:\n', paths.join(' '));
    })

    /*, {read: false})
     .pipe(clean())
     */
})

gulp.task('ios-run', ['setup', 'compile'], function (done) {
    return gulp.start('cordova_run')
})
gulp.task('android-run', ['setup', 'compile'], function (done) {
    return gulp.start('cordova_run')
})

gulp.task('ios', ['watch-dist'], function (done) {
})
gulp.task('android', ['watch-dist'], function (done) {
})
gulp.task('watch-dist', gulpsync.sync(['setup', 'auto', 'default', 'cordova_serve']), function (done) {
        return gulp.watch([paths.dest + '/**/*', "!" + paths.jsDest + "/cordova/**", "!" + paths.jsDest + "/" + buildTimeFile], {
                ignoreInitial: true,
                readDelay: 5000
            },
            batch({timeout: 2000}, function (events, doneBatch) {
                events
                    .on('data', util.log)
                    .on('end', gulp.start('cordova_run'))
            }))
    }
)
gulp.task('mock', ['auto'], function (done) {
    const mvn = require('maven').create({
        cwd: '../pelo-it',
        profiles: ['wiremock']
    });
    mvn.execute([], {'skipTests': true}).then(() => {
        done()
    });
})
//https://github.com/apache/cordova-lib/blob/master/cordova-lib/src/cordova/util.js#L294
gulp.task('cordova_serve', ['auto'], function (done) {

    var cordovaDir = `${paths.root}/cordova/www/`
    process.chdir(cordovaDir)

    return cordova.serve({
        cwd: `${paths.root}/cordova`,
    }, function (e) {
        util.log('cordova callback')
        if (e) {
            util.log('cordova error build result:' + e)
        } else {
            util.log('serving cordova on port 8000')
            cordovaServer.launchBrowser(opts);
            // cordova_refresh()
        }
        process.chdir(paths.root)
        done()
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
    process.chdir(paths.root + "/cordova")
    util.log('building ' + cwd)
    try {
        return cordova.build({
            "verbose": true,
            "platforms": ["android"],
            "options": ["--release",
                "--browserify",
                "--gradleArg=--stacktrace"]
        }, function (e) {
            if (e) {
                util.log('cordova build result:' + e)
            } else {
                util.log('cordova build finshed')
            }
            process.chdir(paths.root)
            readBuildTime()
            done()
        })
    } catch (e) {
        util.log(e.message + " " + e)
        done()
    }
})

gulp.task('cordova_clean', function (done) {
    //FIXME
    cordovaCmd(["clean"], {verbose: true, cwd: process.cwd() + '/cordova'})
    done()
})


gulp.task('cordova_run', function (done) {

    try {
        process.chdir(paths.root + "/cordova")
        cwd = process.cwd()
        util.log('running cordova' + cwd)

        return cordova.run({
            "verbose": true,
            "platforms": ["android"],
            "options": ["--debug"] //"--gradleArg=--no-daemon"]
        }, function (e) {
            if (e) {
                util.log('cordova run result:' + e)
            } else {
                util.log('cordova run finshed')
                //cordova_refresh()
            }
            readBuildTime()
            process.chdir(paths.root)
            done()
        })
    } catch (e) {
        util.log(e.message + " " + e)
        done()
    }
})

function showBuildTime() {
    util.log(buildTime)
}

function dateLog(s) {
    util.log(
        `${s}`
    )
}

//TODO use this somehow with auto to rerun the current task
gulp.task('rerun', function () {
    return run('gulp ' + this.currentTask.name).exec()  // prints "[echo] Hello World\n".
        .pipe(gulp.dest('output'))           // writes "Hello World\n" to output/echo.
})
gulp.task('install', [], function (done) {
    return gulp.src(packageConfig)
        .pipe(diff({hash:'package'}))
        .pipe(install())
    //.on('end',done)
})

gulp.task('setup', ['install'], (done)=> {
    return gulp.src(cordovaConfig)
        .pipe(plumber())
        .pipe(diff({hash:'cordova'}))
        .pipe(cordovaCmd(["prepare"], {verbose: true, cwd: process.cwd() + '/cordova'}))
})

//----------------------------------------------------------------------------------------------------------------------
gulp.task('pix-resize', function (done) {
    var andRes = 'cordova/res/android/'
    var andScreenRes = 'cordova/res/screen/android/'
    var iosRes = 'cordova/res/ios/'
    var iosScreenRes = 'cordova/res/screen/ios/'

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

    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("icon-60@3x.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "180", height: "180",
        }))
        .pipe(gulp.dest(iosRes))
    //// iOS 7.0+ -->
    // iPhone / iPod Touch  -->
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("icon-60.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "60", height: "60",
        }))
        .pipe(gulp.dest(iosRes))
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("icon-60@2x.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "120", height: "120",
        }))
        .pipe(gulp.dest(iosRes))
    // iPad -->
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("icon-76.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "76", height: "76",
        }))
        .pipe(gulp.dest(iosRes))
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("icon-76@2x.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "152", height: "152",
        }))
        .pipe(gulp.dest(iosRes))
    // iOS 6.1 -->
    // Spotlight Icon -->
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("icon-40.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "40", height: "40",
        }))
        .pipe(gulp.dest(iosRes))
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("icon-40@2x.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "80", height: "80",
        }))
        .pipe(gulp.dest(iosRes))
    // iPhone / iPod Touch -->
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("icon.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "57", height: "57",
        }))
        .pipe(gulp.dest(iosRes))
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("icon@2x.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "114", height: "114",
        }))
        .pipe(gulp.dest(iosRes))
    // iPad -->
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("icon-72.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "72", height: "72",
        }))
        .pipe(gulp.dest(iosRes))
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("icon-72@2x.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "144", height: "144",
        }))
        .pipe(gulp.dest(iosRes))
    // iPhone Spotlight and Settings Icon -->
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("icon-small.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "29", height: "29",
        }))
        .pipe(gulp.dest(iosRes))
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("icon-small@2x.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "58", height: "58",
        }))
        .pipe(gulp.dest(iosRes))
    // iPad Spotlight and Settings Icon -->
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("icon-50.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "50", height: "50",
        }))
        .pipe(gulp.dest(iosRes))
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("icon-50@2x.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "100", height: "100",
        }))
        .pipe(gulp.dest(iosRes))

    //screen
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("Default~iphone.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "320", height: "480",
        }))
        .pipe(gulp.dest(iosScreenRes))
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("Default@2x~iphone.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "640", height: "960",
        }))
        .pipe(gulp.dest(iosScreenRes))
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("Default-Portrait~ipad.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "768", height: "1024",
        }))
        .pipe(gulp.dest(iosScreenRes))
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("Default-Portrait@2x~ipad.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "1536", height: "2048",
        }))
        .pipe(gulp.dest(iosScreenRes))
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("Default-Landscape~ipad.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "1024", height: "768",
        }))
        .pipe(gulp.dest(iosScreenRes))
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("Default-Landscape@2x~ipad.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "2048", height: "1536",
        }))
        .pipe(gulp.dest(iosScreenRes))
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("Default-568h@2x~iphone.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "640", height: "1136",
        }))
        .pipe(gulp.dest(iosScreenRes))
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("Default-667h.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "750", height: "1334",
        }))
        .pipe(gulp.dest(iosScreenRes))
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("Default-736h.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "1242", height: "2208",
        }))
        .pipe(gulp.dest(iosScreenRes))
    gulp.src(paths.imgSrc + '/logo.png')
        .pipe(diff())
        .pipe(rename("Default-Landscape-736h.png"))
        .pipe(imageResize({
            imageMagick: true,
            crop: true,
            upscale: false,
            width: "2208", height: "1242",
        }))
        .pipe(gulp.dest(iosScreenRes))

})

