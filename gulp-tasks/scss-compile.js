'use strict';

/**
 * Compile stylesheets
 */

module.exports = function() {

let gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano');

    var processors = [
        autoprefixer,
        cssnano
    ];

    return gulp.src(['./stylesheets/main.scss'])
       .pipe(sass().on('error', sass.logError))
       .pipe(postcss(processors))
        .pipe(gulp.dest('./assets/css/'));

};
