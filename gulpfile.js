const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require("gulp-rename");
const glob = require('glob');

gulp.task('sass', function () {
  let entryFiles = glob.sync('./scss/*.scss');
  entryFiles.map((file) => {
    let destDir = file.match(/\w+(?=\.scss)/)[0]
    gulp.src(file)
      .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
      .pipe(rename({
        extname: '.wxss'
      }))
      .pipe(gulp.dest('./pages/' + destDir + '/'))
  })
});

gulp.task('watch', function () {
  gulp.watch('./scss/*.scss', ['sass']);
});
