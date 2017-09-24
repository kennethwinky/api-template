const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const nodemon = require('gulp-nodemon');
const changed = require('gulp-changed');
const eslint = require('gulp-eslint');

const files = {
  config: path.resolve(__dirname, 'config/*.js'),
  gulpfile: path.resolve(__dirname, 'gulpfile.js'),
  src: `${path.resolve(__dirname, 'src')}/**/*.js`,
  dist: path.resolve(__dirname, 'dist'),
};

gulp.task('dist:clean', () => {
  return gulp.src(files.dist, { read: false })
  .pipe(clean());
});

gulp.task('dist:config', () => {
  return gulp.src(files.config)
  .pipe(babel())
  .pipe(gulp.dest(path.resolve(files.dist, 'config')));
});

gulp.task('dist:build', ['dist:config'], () => {
  return gulp.src(files.src)
  .pipe(changed(files.dist))
  .pipe(babel())
  .pipe(gulp.dest(files.dist));
});

gulp.task('src:eslint', () => {
  return gulp.src(files.src)
  .pipe(changed(files.src))
  .pipe(eslint())
  .pipe(eslint.format());
});

gulp.task('watch:dist', () => {
  gulp.watch(files.src, ['dist:build']);
});

gulp.task('watch:src', () => {
  gulp.watch(files.src, ['src:eslint']);
});

gulp.task('server', ['dist:build', 'watch:dist'], () => {
  nodemon({
    script: 'dist/index.js',
    ext: 'js',
    env: process.env,
  });
});

gulp.task('default', ['server']);
