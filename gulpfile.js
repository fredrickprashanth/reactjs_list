var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var server = require('gulp-express');
var source = require('vinyl-source-stream');


paths = {
    js : [ "./js/*.js" ],
};

gulp.task('js', function() {
        browserify()
            .transform(reactify)
            .add("./js/main.js")
            .bundle()
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('./public/'));
});

gulp.task('serve', function() {
        server.run(['./bin/www']);
});


