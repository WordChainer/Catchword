const gulp  = require('gulp');
const minifyJS = require('gulp-uglify-es').default;
const minifyCSS = require('gulp-clean-css');
const rename = require('gulp-rename');

gulp.task('minify-js', () => {
    return gulp.src('lib/js/*.js')
        .pipe(minifyJS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('public/js'));
});

gulp.task('minify-css', () => {
    return gulp.src('lib/css/*.css')
        .pipe(minifyCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('public/css'));
});

gulp.task('watch', () => {
    gulp.watch('lib/js/*.js', gulp.series('minify-js'));
    gulp.watch('lib/css/*.css', gulp.series('minify-css'));
});

gulp.task('default', gulp.series('minify-js', 'minify-css'));
