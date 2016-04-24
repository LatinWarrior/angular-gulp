var gulp = require('gulp'),
    plugins = require('gulp-load-plugins'),
    connect = require('gulp-connect'),
    PORT = '3000',
    SERVER = 'http://localhost:3000';

var jsFiles = ['*.js', 'src/**/*.js'];

gulp.task('style', function() {
    return gulp
        .src(jsFiles)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(plugins.jscs());
});

gulp.task('inject', function() {

    //var wiredep = require('wiredep').stream;
    //var inject = require('gulp-inject');

    var injectSrc = gulp.src(['./src/styles/*.css', './src/app/**.js'], { read: false });

    var injectOptions = {
        ignorePath: ['./bower_components', './node_modules']
    };

    var options = {
        boweJson: require('./bower.json'),
        directory: './bower_components',
        ignorePath: '../'
    };

    return gulp.src('./src/*.html')
        .pipe(plugins.wiredep(options))
        .pipe(plugins.inject(injectSrc, injectOptions))
        .pipe(gulp.dest('./src'));
});

gulp.task('connect', function() {

    // var connect = require('gulp-connect'),
    //     serveStatic = require('serve-static');

    connect
        .server({
            root: [__dirname],
            livereload: true,
            port: PORT,
            open: {
                file: 'src/index.html'
            }
        });

    // var app = connect()
    //     .use(require('connect-livereload')({ port: 35729 }))
    //     .use(serveStatic('src'));
    //     //.use(connect.reload());

    // require('http')
    //     .createServer(app)
    //     .listen(PORT)
    //     .on('listening', function() {
    //         console.log('Started connect web server on http://localhost:', SERVER);
    //     });
});

gulp.task('html', function() {
    gulp
        .src('./src/*.html')
        .pipe(connect.reload());
});

gulp.task('serve-dev', ['html', 'connect'], function() {

    require('opn')(SERVER);

});

gulp.task('watch', ['serve-dev'], function() {

    // var options = {
    //     script: 'src/app/app.module.js',
    //     watch: jsFiles
    // };

    // return plugins.nodemon(options)
    //     .on('restart', function(evt) {
    //         console.log('Restarting...');
    //     });

    var server = plugins.livereload();

    gulp.watch([
        'src/**/*.html',
        'src/app/**/*.js',
        'src/styles/*.css'
    ]).on('change', function(file) {
        console.log('File changed: ' + file.path);
        server.changed(file.path);
    });

    gulp.watch(jsFiles['scripts']);

});

gulp.task('default', function(callback) {
    plugins.runSequence('style', 'inject', 'connect', 'serve-dev', 'watch', callback);
});