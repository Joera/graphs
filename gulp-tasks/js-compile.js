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
            './node_modules/babel-polyfill/dist/polyfill.js',
            './src/_polyfill.js',
            './src/_sluggify.js',
            './src/_colours.js',
            './src/_formats.js',
            './src/_helpers.js',
            './src/_sankey.js',

            './src/chart-init-objects.js',
            './src/chart-dimensions.js',
            './src/chart-svg.js',
            './src/chart-x-scale.js',
            './src/chart-y-scale.js',
            './src/chart-axis.js',
            './src/chart-legend.js',
            './src/chart-line.js',
            './src/chart-bar.js',
            './src/chart-bars-increase.js',
            './src/chart-stacked-bars.js',
            './src/chart-stacked-bars-normalized.js',
            './src/chart-stacked-area.js',
            './src/chart-blocks.js',
            './src/chart-area.js',
            './src/chart-sankey.js',
            './src/chart-map.js',
            './src/chart-pie.js',

            // './src/tcmg-charts.js',

            './src/default/opnames.js',
            './src/default/aos-meldingen.js',
            './src/default/meldingen.js',
            './src/default/weekverloop.js',
            './src/default/gemeentes.js',
            './src/default/stroommodel.js',
            './src/default/bedragen.js',
            './src/default/verdeling.js',
            './src/default/voortgang.js',
            './src/default/voortgang_details.js',
            './src/default/voortgang_duur.js',
            './src/default/candles.js',
            './src/default/statussen.js',
            './src/default/status-looptijden.js',
            './src/default/looptijden-status.js',
            './src/default/force-looptijden-status.js',
            './src/default/statussen-stroommodel.js',
            './src/default/statussen-stroommodel_ii.js',
            './src/default/pie-chart-sum.js',
            './src/default/pie-chart-herkomst.js',
            './src/default/pie-chart-opnames.js',
            './src/default/pie-chart-bezwaren.js',
            './src/default/specials-share-completed.js'


            ])
            .pipe(concat('main.js'))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(scriptsDir));

        // var basics = gulp.src([
        //     './node_modules/babel-polyfill/dist/polyfill.js',
        //     './src/_polyfill.js',
        //     './src/_sluggify.js',
        //     './src/_colours.js',
        //     './src/_formats.js',
        //     './src/_helpers.js',
        //     './src/_sankey.js',
        //
        //     './src/chart-init-objects.js',
        //     './src/chart-dimensions.js',
        //     './src/chart-svg.js',
        //     './src/chart-x-scale.js',
        //     './src/chart-y-scale.js',
        //     './src/chart-axis.js',
        //     './src/chart-legend.js',
        //     './src/chart-line.js',
        //     './src/chart-bar.js',
        //     './src/chart-bars-increase.js',
        //     './src/chart-stacked-bars.js',
        //     './src/chart-stacked-area.js',
        //     './src/chart-blocks.js',
        //     './src/chart-area.js',
        //     './src/chart-sankey.js',
        //     './src/chart-map.js'
        // ])
        //     .pipe(concat('graph-basics.js'))
        //     .pipe(babel({
        //         presets: ['es2015']
        //     }))
        //     .pipe(gulp.dest(scriptsDir));

        return merge(graph);  // ,genericmap,projectmap,accessibilitymap
    });
}