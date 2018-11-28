'use strict';

const gulp = require('gulp');
const gulpTaskLoader = require('gulp-task-loader')('./gulp-tasks'); // load tasks from other files. Allows to write each gulp task into a separate file


// gulp.task('default', gulp.series('scss-compile','js-compile'));

// gulp.task('default', gulp.series('scss-compile', function() {
//     // default task code here
// }));
