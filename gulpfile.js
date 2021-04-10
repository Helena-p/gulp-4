const { src, dest, watch, series, parallel } = require("gulp");

const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const combinemq = require("postcss-combine-media-query");
const cssnano = require("cssnano");

const concat = require("gulp-concat");
const uglify = require("gulp-uglify");

// Sass tasks
function scssTask() {
  return src("app/scss/style.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), combinemq(), cssnano()]))
    .pipe(dest("dist", { sourcemaps: "." }));
}

// Js tasks
function jsTask() {
  return src(["app/js/script.js", "app/js/script2.js"], { sourcemaps: true })
    .pipe(concat("scripts.js"))
    .pipe(uglify())
    .pipe(dest("dist", { sourcemaps: "." }));
}

exports.default = series(scssTask, jsTask);
