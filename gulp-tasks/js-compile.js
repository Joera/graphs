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
            './src/_polyfill.js',
            './src/_sluggify.js',
            './src/chart-init-objects.js',
            './src/chart-dimensions.js',
            './src/chart-svg.js',
            './src/chart-scales.js',
            './src/chart-axis.js',
            './src/chart-legend.js',
            './src/chart-line.js',
            './src/chart-bar.js',
            './src/chart-stacked-bars.js',
            './src/chart-stacked-area.js',
            './src/chart-blocks.js',
            './src/chart-area.js',
            './src/tcmg-charts.js'
            ])
            .pipe(concat('main.js'))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(scriptsDir));

        return merge(graph);  // ,genericmap,projectmap,accessibilitymap
    });
}