const { src, dest, watch, series, parallel } = require("gulp");

const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const combinemq = require("postcss-combine-media-query");
const cssnano = require("cssnano");

const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");

// utilities
const del = require("del");
const imagemin = require("gulp-imagemin");
const replace = require("gulp-replace");

// Sass tasks
function scssTask() {
  return src("app/scss/style.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer(), combinemq(), cssnano()]))
    .pipe(dest("dist", { sourcemaps: "." }));
}

// browserify only take one file as parameter,
// therefor concat js files first
function concatJsTask() {
  return src("app/js/*.js").pipe(concat("scripts.js")).pipe(dest("app/js"));
}

function browserifyTask() {
  return browserify("app/js/scripts.js")
    .bundle()
    .pipe(source("scripts.js"))
    .pipe(buffer())
    .pipe(dest("app/js"));
}

// Js tasks
function jsTask() {
  return src("app/js/scripts.js", { sourcemaps: true })
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(uglify())
    .pipe(dest("dist", { sourcemaps: "." }));
}

function cleanTask() {
  return del(["app/js/scripts.js"]);
}

// minify images
function imageminTask() {
  return src("img/*")
    .pipe(
      imagemin(
        [
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ quality: 75, progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 }),
          imagemin.svgo({
            plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
          }),
        ],
        { verbose: true }
      )
    )
    .pipe(dest("img"));
}

// cache-busting
function cacheBustTask() {
  let cbNumber = new Date().getTime();
  return src("index.html")
    .pipe(replace(/cb=\d+/g, "cb=" + cbNumber))
    .pipe(dest("."));
}

exports.default = series(
  scssTask,
  concatJsTask,
  browserifyTask,
  jsTask,
  cleanTask,
  imageminTask,
  cacheBustTask
);
