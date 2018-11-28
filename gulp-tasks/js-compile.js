'use strict';

/**
 * Remove json data from the news queue
 */
module.exports = function() {

    let gulp = require('gulp'),
        babel = require('gulp-babel'),
        concat = require('gulp-concat'),
        merge = require('merge-stream'),
        scriptsDir = './assets/scripts/';


    gulp.task('js-compile', function() {

        var graph = gulp.src([
            './src/procedure.js',
            './src/init.js'
            ])
            .pipe(concat('main.js'))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(scriptsDir));

        return merge(graph);  // ,genericmap,projectmap,accessibilitymap
    });
}