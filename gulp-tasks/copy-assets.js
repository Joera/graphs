'use strict';

/**
 * Compile stylesheets
 */

module.exports = function() {

    let gulp = require('gulp');
    var copy = require('gulp-contrib-copy');
    let path = require('../local-path')();

    let sourceFiles = [path.projectFolder + 'assets/**/*', path.projectFolder + 'assets/*'];
    let destination = path.distFolder + '/assets/';

    return gulp.src(sourceFiles)

        .pipe(copy())
        .pipe(gulp.dest(destination));

};
