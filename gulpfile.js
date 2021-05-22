const gulp  = require('gulp');
const minifyJS = require('gulp-uglify-es').default;
const minifyCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const imagemin = require('gulp-image');
const rename = require('gulp-rename');

sass.compiler = require('node-sass');

gulp.task('minify-js', () => {
    return gulp.src('lib/js/*.js')
        .pipe(minifyJS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('public/js'));
});

gulp.task('minify-css', () => {
    return gulp.src('lib/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('public/css'));
});

gulp.task('minify-image', () => {
    return gulp.src('public/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('public/images'));
});

gulp.task('watch', () => {
    gulp.watch('lib/js/*.js', gulp.series('minify-js'));
    gulp.watch('lib/scss/**/*.scss', gulp.series('minify-css'));
});

gulp.task('default', gulp.series('minify-js', 'minify-css'));
