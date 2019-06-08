/*
 * Gulpfile.js
 * Copyright (c) 2019 Luca J
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Module Dependencies.
 * @private
 */

const { src, dest, series, parallel, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
// autoprefixer uses 'browserslist' -> set 'browserslist' key in package.json
const autoprefixer = require('autoprefixer');
const rename = require('gulp-rename');
const del = require('del');


/**
 * Module Variables
 * @private
 */

const reload = browserSync.reload;

/**
 * Module exports.
 * @public
 */

exports.build   = series(clean, parallel(html, assets, css, js));
exports.serve   = series(exports.build, serve);
exports.clean   = clean;
exports.default = exports.serve;

/**
 * Copy html files.
 * @private
 */

function html() {
  return src(['src/index.html', 'src/pages/**/*.html'])
    .pipe(dest('build/'));
}

/**
 * Copy all assets in the 'assets' folder.
 * @private
 */

function assets() {
  return src('src/assets/**/*')
    .pipe(dest('build/assets/'));
}

/**
 * Compile sass to css and copy.
 * @private
 */

function css() {
  return src('src/sass/materialize.scss')
    .pipe(sass())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(dest('build/css'));
}

/**
 * Process and copy polished .js files to the build folder.
 * @private
 */

function js() {
  return src(`src/js/bin/materialize.min.js`)
    .pipe(rename({ basename: 'scripts.min'}))
    .pipe(dest('build/js/'));
}

/**
 * Watch for file changes, copy files, and refresh browser.
 * @private
 */

function serve() {
  browserSync.init({
    server: './build/'
  });

  watch('src/**/*.html', html);
  watch('src/assets/**/*', assets);
  watch('src/sass/**/*.scss', css);
  watch('build/**/*').on('change', reload);
}

/**
 * Clean the build directory.
 * @public
 */

function clean() {
  return del('build');
}

