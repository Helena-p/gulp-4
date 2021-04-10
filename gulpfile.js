const { src, dest, watch, series, parallel } = require("gulp");

const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const combinemq = require("postcss-combine-media-query");
const cssnano = require("cssnano");

// Sass tasks
function scssTask() {
  return src("app/scss/style.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), combinemq(), cssnano()]))
    .pipe(dest("dist", { sourcemaps: "." }));
}

exports.default = scssTask;
