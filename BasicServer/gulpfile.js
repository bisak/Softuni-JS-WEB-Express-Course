var gulp = require('gulp')
var htmlmin = require('gulp-htmlmin')

gulp.task('minify', function () {
  return gulp.src('./*.html', { base: './' })
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./'))
})
